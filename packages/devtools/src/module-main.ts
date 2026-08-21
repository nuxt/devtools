import type { PluginWithDevTools } from '@vitejs/devtools-kit'
import type { StaticAssetsSource } from 'devframe'
import type { Nuxt } from 'nuxt/schema'
import type { Plugin } from 'vite'
import type { ModuleOptions, NuxtDevToolsOptions } from './types'
import type { AnyNitroConfig } from './utils/nitro-compat'
import os from 'node:os'
import { deprecate, NUXT_DEVTOOLS_GROUP_ID } from '@nuxt/devtools-kit'
import { addImports, addPlugin, addTemplate, addVitePlugin, extendViteConfig, logger } from '@nuxt/kit'
import { colors } from 'consola/utils'
import { serveStaticNodeMiddleware } from 'devframe/utils/serve-static'
import { join } from 'pathe'
import { searchForWorkspaceRoot } from 'vite'
import { peerDependencies, version } from '../package.json'
import { createDefaultTabOptions, setServerTasksEnabledByDefault } from './constant'
import { packageDir, runtimeDir } from './dirs'
import { setupRPC } from './server-rpc'
import { skipInSSR } from './server-rpc/skip-in-ssr'
import { readLocalOptions } from './utils/local-options'

const MULTIPLE_SLASHES_RE = /\/+/g

/**
 * The published package holding the built client UI, version-locked to this
 * package and declared as an optional peer dependency. Served as devframe
 * remote assets: a locally installed copy wins (zero network — the monorepo
 * and air-gapped installs), then the on-disk cache, then a CDN mirror of npm.
 */
const ASSETS_PACKAGE = '@nuxt/devtools-assets'

/**
 * Resolve the `StaticAssetsSource` for the client UI, honoring the
 * `clientAssets` module option (`false` = don't mount, a string = serve that
 * local directory).
 *
 * Nightly releases rename workspace packages through `npm:<name>-nightly@<v>`
 * alias ranges (see `scripts/bump-nightly.ts`), so the real assets package
 * name is read back from our own peer-dependency entry — a nightly build then
 * fetches its matching nightly assets.
 */
function resolveClientAssetsSource(options: ModuleOptions): StaticAssetsSource | undefined {
  if (options.clientAssets === false)
    return undefined
  if (typeof options.clientAssets === 'string')
    return options.clientAssets
  const range: string = (peerDependencies as Record<string, string>)[ASSETS_PACKAGE] ?? ''
  const name = range.startsWith('npm:')
    ? range.slice('npm:'.length, range.lastIndexOf('@'))
    : ASSETS_PACKAGE
  return {
    package: name,
    version,
    resolveFrom: import.meta.url,
  }
}

export async function enableModule(options: ModuleOptions, nuxt: Nuxt) {
  // Disable in test mode
  if (process.env.TEST || process.env.NODE_ENV === 'test' || nuxt.options.test)
    return

  if (nuxt.options.builder !== '@nuxt/vite-builder') {
    logger.warn('Nuxt DevTools only supports Vite mode, module is disabled.')
    return
  }

  if (!nuxt.options.dev) {
    if (nuxt.options.build.analyze && (nuxt.options.build.analyze === true || nuxt.options.build.analyze.enabled))
      await import('./integrations/analyze-build').then(({ setup }) => setup(nuxt, options))
    return
  }

  await nuxt.callHook('devtools:before')

  // `disableAuthorization` disables the Vite DevTools client-auth prompt. The
  // resolved value is used (default `isSandboxed`), so sandboxes keep
  // auto-bypassing the prompt.
  if (options.disableAuthorization) {
    extendViteConfig((config) => {
      const devtoolsConfig = ((config as any).devtools ||= {})
      if (devtoolsConfig.clientAuth === undefined)
        devtoolsConfig.clientAuth = false
    })
  }

  if (options.iframeProps) {
    nuxt.options.runtimeConfig.app.devtools ||= {}
    nuxt.options.runtimeConfig.app.devtools.iframeProps = options.iframeProps
  }

  // Make unimport exposing more information, like the usage of each auto imported function
  nuxt.options.imports.collectMeta = true

  addPlugin({
    src: join(runtimeDir, 'plugins/devtools.client'),
    mode: 'client',
  })

  addPlugin({
    src: join(runtimeDir, 'plugins/devtools.server'),
    mode: 'server',
  })

  // See #980
  if (nuxt.options.dev) {
    nuxt.options.vite.optimizeDeps ||= {}
    nuxt.options.vite.optimizeDeps.include ||= []
    nuxt.options.vite.optimizeDeps.include.push(
      // Vite DevTools 0.5's embedded client is served by the hub as an external
      // `embedded.js` script (see `runtime/plugins/vite-devtools.client`), so it
      // is no longer a bundler-resolved `@vitejs/devtools/client/inject` import to
      // pre-bundle here.
      'nuxt > @nuxt/devtools > @vitejs/devtools-kit/client',
      'nuxt > @nuxt/devtools > error-stack-parser-es',
      'nuxt > @nuxt/devtools > vite-plugin-vue-tracer/client/overlay',
    )
  }

  const ROUTE_PATH = `${nuxt.options.app.baseURL || '/'}/__nuxt_devtools__`.replace(MULTIPLE_SLASHES_RE, '/')
  const ROUTE_CLIENT = `${ROUTE_PATH}/client`
  const ROUTE_ANALYZE = `${ROUTE_PATH}/analyze`

  const clientAssetsSource = resolveClientAssetsSource(options)
  // Where the client UI lives from the browser's point of view. With
  // `clientAssets: false` the app under development *is* the client (the
  // dogfooding `nuxi dev client` flow), already served live on its own base.
  const clientUrl = clientAssetsSource
    ? `${ROUTE_CLIENT}/`
    : `${nuxt.options.app.baseURL || '/'}/`.replace(MULTIPLE_SLASHES_RE, '/')

  const DevTools = await import('@vitejs/devtools').then(r => r.DevTools())
  addVitePlugin(DevTools)

  // Deferred: will be set when Vite DevTools plugin setup runs
  let connectDevToolsKit: ((ctx: any) => void | Promise<void>) | undefined

  // Do NOT pass `{ server: false }` here: under Nuxt 5 / Vite 8 the kit wraps
  // the plugin in an `applyToEnvironment` shell that strips the `devtools`
  // property, so `@vitejs/devtools` silently drops the dock entry. The
  // original client-vs-server RPC race is already handled by the guard inside
  // `connectDevToolsKit` (`if (devtoolsKitCtx) return`).
  addVitePlugin(defineViteDevToolsPlugin({
    name: 'nuxt:devtools',
    devtools: {
      async setup(ctx) {
        // Only the browser-serving client Vite context registers the `Nuxt`
        // group and its hub member — Nuxt's SSR Vite instance runs this same
        // setup callback too, and would otherwise create a second, inert
        // group + hub member. See `skipInSSR`.
        if (!skipInSSR(ctx)) {
          if (clientAssetsSource) {
            // The client SPA ships relative asset URLs (mount-path portable),
            // which only resolve on the directory URL — send `…/client` to
            // `…/client/` before the static mount sees it.
            ctx.viteServer?.middlewares.use((req, res, next) => {
              const [pathname = '', search = ''] = (req.url ?? '').split('?')
              if (pathname !== ROUTE_CLIENT)
                return next()
              res.statusCode = 302
              res.setHeader('Location', `${ROUTE_CLIENT}/${search ? `?${search}` : ''}`)
              res.end()
            })
            // Serve `__connection.json` on the client's base (registered
            // before the static mount so its SPA fallback doesn't swallow the
            // route) — the same mounting the hub does for each devframe it
            // installs. Inside the hub's iframe the injected parent connection
            // wins; this makes a *direct* navigation to the client discover
            // the RPC endpoint too.
            if (ctx.host.mountConnectionMeta)
              await ctx.host.mountConnectionMeta(`${ROUTE_CLIENT}/`)
            // devframe's own static hosting: a local directory is served
            // directly; the default remote source resolves per request from a
            // locally installed `@nuxt/devtools-assets`, the on-disk cache, or
            // its CDN back-proxy (https://devfra.me/guide/client-assets.html).
            ctx.views.hostStatic(ROUTE_CLIENT, clientAssetsSource)
          }

          // Register the `Nuxt` group and a single **shared-frame anchor**
          // iframe. The anchor owns one kept-alive iframe (its `frameId`); the
          // client app ships a `devframe:frame-nav` postMessage shim that
          // announces one member dock per DevTools tab and soft-navigates
          // between them within that one iframe — no per-tab reload, and no
          // Node-side tab list. Requires `@vitejs/devtools` >= 0.4.5 /
          // `@devframes/hub` >= 0.7.11 (devframe#128 / vitejs/devtools#464).
          ctx.docks.register({
            id: NUXT_DEVTOOLS_GROUP_ID,
            type: 'group',
            title: 'Nuxt',
            icon: `${clientUrl}nuxt.svg`,
            category: 'framework',
            defaultOrder: -2000,
            defaultChildId: 'nuxt:devtools',
            categoryOrder: {
              pinned: 0,
              app: 1,
              analyze: 2,
              server: 3,
              modules: 4,
              documentation: 5,
              advanced: 6,
            },
          })

          ctx.docks.register({
            id: 'nuxt:devtools',
            type: 'iframe',
            title: 'Nuxt DevTools',
            icon: `${clientUrl}nuxt.svg`,
            url: clientUrl,
            groupId: NUXT_DEVTOOLS_GROUP_ID,
            frameId: 'nuxt:devtools',
            subTabs: { protocol: 'postmessage' },
            visibility: 'false',
            defaultOrder: -300,
          })
        }

        // Connect Nuxt DevTools to Vite DevTools Kit context
        await connectDevToolsKit?.(ctx)
      },
    },
  }))
  addPlugin({
    src: join(runtimeDir, 'plugins/vite-devtools.client'),
    mode: 'client',
  })

  // Mainly for the injected runtime plugin to access the settings
  // Usage `import settings from '#build/devtools/settings'`
  addTemplate({
    filename: 'devtools/settings.mjs',
    async getContents() {
      const uiOptions = await readLocalOptions<NuxtDevToolsOptions['ui']>(
        createDefaultTabOptions().ui,
        { root: nuxt.options.rootDir },
      )
      return `export default ${JSON.stringify({
        ui: uiOptions,
      })}`
    },
  })

  nuxt.hook('nitro:config', (config: AnyNitroConfig) => {
    // Check user opted-in for tasks
    if (config.experimental?.tasks)
      setServerTasksEnabledByDefault(true)

    // Inject inline script. Force our small runtime plugin to be bundled
    // rather than externalized as a node_modules import at runtime — Nitro v2
    // (`nitropack`) and Nitro v3 (`nitro`) expose this via different config
    // shapes (`externals.inline` vs `noExternals`), so `config`'s type here is
    // a union of both; handle whichever applies.
    const inlinePath = join(runtimeDir, 'nitro')
    if ('externals' in config) {
      config.externals ||= {}
      config.externals.inline ||= []
      config.externals.inline.push(inlinePath)
    }
    if ('noExternals' in config && Array.isArray(config.noExternals)) {
      config.noExternals.push(inlinePath)
    }
    else if (!('noExternals' in config) || config.noExternals === undefined) {
      config.noExternals = [inlinePath]
    }
    config.virtual = config.virtual || {}
    config.virtual['#nuxt-devtools-inline'] = `export const script = \`
if (!window.__NUXT_DEVTOOLS_TIME_METRIC__) {
  Object.defineProperty(window, '__NUXT_DEVTOOLS_TIME_METRIC__', {
    value: {},
    enumerable: false,
    configurable: true,
  })
}
window.__NUXT_DEVTOOLS_TIME_METRIC__.appInit = Date.now()
\``
    config.plugins = config.plugins || []
    config.plugins.unshift(join(runtimeDir, 'nitro/inline'))
  })

  // Destructure `ctx` as a nested property rather than spreading it
  // (`...ctx`): `ctx.devtoolsKit` is a live getter, and spreading it into a
  // new object would freeze it to its pre-connect (`undefined`) value for
  // every integration below (see the comment in `server-rpc/index.ts`).
  const {
    connectDevToolsKit: _connectDevToolsKit,
    ctx,
  } = setupRPC(nuxt, options)

  connectDevToolsKit = _connectDevToolsKit

  extendViteConfig((config) => {
    config.server ||= {}
    config.server.fs ||= {}
    config.server.fs.allow ||= [
      searchForWorkspaceRoot(process.cwd()),
    ]
    config.server.fs.allow.push(packageDir)

    config.server.watch ||= {}
    config.server.watch.ignored ||= []
    if (!Array.isArray(config.server.watch.ignored))
      config.server.watch.ignored = [config.server.watch.ignored]
    config.server.watch.ignored.push('**/.nuxt/analyze/**')
    config.server.watch.ignored.push('**/.cache/nuxt-devtools/**')
  })

  addImports({
    name: 'useNuxtDevTools',
    from: join(runtimeDir, 'use-nuxt-devtools'),
  })

  // TODO: Use WS from nitro server when possible
  nuxt.hook('vite:serverCreated', (server) => {
    const devtoolsAnalyzeDir = join(nuxt.options.rootDir, 'node_modules/.cache/nuxt-devtools/analyze')

    server.middlewares.use(ROUTE_ANALYZE, serveStaticNodeMiddleware(devtoolsAnalyzeDir, { single: false }))
  })

  await import('./integrations/plugin-metrics').then(({ setup }) => setup(ctx))

  if (options.dataInspector !== false)
    await import('./integrations/data-inspector').then(({ setup }) => setup(ctx))

  if (options.viteInspect !== false)
    await import('./integrations/vite-inspect').then(({ setup }) => setup(ctx))

  if (options.componentInspector !== false)
    await import('./integrations/vue-tracer').then(({ setup }) => setup(ctx))

  if (options.codeServer?.enabled === false && options.vscode !== undefined) {
    deprecate(nuxt, 'NDT_DEP_0008', {
      api: 'devtools.vscode',
      replacement: 'devtools.codeServer',
    })
  }

  const integrations = [
    options.codeServer?.enabled !== false
      ? import('./integrations/code-server').then(({ setup }) => setup(ctx))
      : null,
    (options.experimental?.timeline || options.timeline?.enabled)
      ? import('./integrations/timeline').then(({ setup }) => setup(ctx))
      : null,
  ]

  await Promise.all(integrations)

  nuxt.hook('modules:done', () => nuxt.callHook('devtools:initialized', {
    version,
    packagePath: packageDir,
  }))

  const isMac = os.platform() === 'darwin'

  logger.log([
    colors.yellow(`  ➜ DevTools: `),
    colors.dim('press '),
    colors.green('Shift'),
    colors.dim(' + '),
    colors.green(isMac ? 'Option' : 'Alt'),
    colors.dim(' + '),
    colors.green('D'),
    colors.dim(` in the browser (v${version})`),
    '\n',
  ].join(''))
}

function defineViteDevToolsPlugin(plugin: PluginWithDevTools): Plugin<any> {
  return plugin as any
}
