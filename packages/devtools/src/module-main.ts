import type { PluginWithDevTools } from '@vitejs/devtools-kit'
import type { ServerResponse } from 'node:http'
import type { Nuxt } from 'nuxt/schema'
import type { Plugin } from 'vite'
import type { ModuleOptions, NuxtDevToolsOptions } from './types'
import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import os from 'node:os'
import { NUXT_DEVTOOLS_GROUP_ID } from '@nuxt/devtools-kit'
import { addImports, addPlugin, addTemplate, addVitePlugin, extendViteConfig, logger } from '@nuxt/kit'
import { colors } from 'consola/utils'
import { join } from 'pathe'
import sirv from 'sirv'
import { searchForWorkspaceRoot } from 'vite'
import { version } from '../package.json'
import { createDefaultTabOptions, setServerTasksEnabledByDefault } from './constant'
import { clientDir, packageDir, runtimeDir } from './dirs'
import { setupRPC } from './server-rpc'
import { skipInSSR } from './server-rpc/skip-in-ssr'
import { readLocalOptions } from './utils/local-options'

const MULTIPLE_SLASHES_RE = /\/+/g
const DEVTOOLS_BASE_RE = /\/__NUXT_DEVTOOLS_BASE__\//g

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
      'nuxt > @nuxt/devtools > @vue/devtools-kit',
      'nuxt > @nuxt/devtools > @vue/devtools-core',
      'nuxt > @nuxt/devtools > @vitejs/devtools/client/inject',
      'nuxt > @nuxt/devtools > @vitejs/devtools-kit/client',
      'nuxt > @nuxt/devtools > error-stack-parser-es',
      'nuxt > @nuxt/devtools > vite-plugin-vue-tracer/client/overlay',
    )
  }

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
          ctx.docks.register({
            id: NUXT_DEVTOOLS_GROUP_ID,
            type: 'group',
            title: 'Nuxt',
            icon: '/__nuxt_devtools__/client/nuxt.svg',
            defaultOrder: -2000,
            defaultChildId: 'nuxt:devtools',
          })

          ctx.docks.register({
            id: 'nuxt:devtools',
            type: 'iframe',
            icon: '/__nuxt_devtools__/client/nuxt.svg',
            title: 'Nuxt DevTools',
            url: '/__nuxt_devtools__/client/',
            groupId: NUXT_DEVTOOLS_GROUP_ID,
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

  nuxt.hook('nitro:config', (config) => {
    // Check user opted-in for tasks
    if (config.experimental?.tasks)
      setServerTasksEnabledByDefault(true)

    // Inject inline script
    config.externals = config.externals || {}
    config.externals.inline = config.externals.inline || []
    config.externals.inline.push(join(runtimeDir, 'nitro'))
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

  const clientDirExists = existsSync(clientDir)

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

  const ROUTE_PATH = `${nuxt.options.app.baseURL || '/'}/__nuxt_devtools__`.replace(MULTIPLE_SLASHES_RE, '/')
  const ROUTE_CLIENT = `${ROUTE_PATH}/client`
  const ROUTE_ANALYZE = `${ROUTE_PATH}/analyze`

  // TODO: Use WS from nitro server when possible
  nuxt.hook('vite:serverCreated', (server) => {
    const devtoolsAnalyzeDir = join(nuxt.options.rootDir, 'node_modules/.cache/nuxt-devtools/analyze')

    server.middlewares.use(ROUTE_ANALYZE, sirv(devtoolsAnalyzeDir, { single: false, dev: true, dotfiles: true, ignores: false }))

    // Serve the front end in production
    if (clientDirExists) {
      const indexHtmlPath = join(clientDir, 'index.html')
      const indexContent = fs.readFile(indexHtmlPath, 'utf-8')
      const handleStatic = sirv(clientDir, {
        dev: true,
        single: false,
      })
      // We replace the base URL in the index.html based on user's settings
      const handleIndex = async (res: ServerResponse) => {
        res.setHeader('Content-Type', 'text/html')
        res.statusCode = 200
        res.write((await indexContent).replace(DEVTOOLS_BASE_RE, `${ROUTE_CLIENT}/`))
        res.end()
      }
      server.middlewares.use(ROUTE_CLIENT, (req, res) => {
        if (req.url === '/')
          return handleIndex(res)
        return handleStatic(req, res, () => handleIndex(res))
      })
    }
  })

  await import('./integrations/plugin-metrics').then(({ setup }) => setup(ctx))

  if (options.vueDevTools !== false)
    await import('./integrations/vue-devtools').then(({ setup }) => setup(ctx))

  if (options.viteInspect !== false)
    await import('./integrations/vite-inspect').then(({ setup }) => setup(ctx))

  if (options.componentInspector !== false)
    await import('./integrations/vue-tracer').then(({ setup }) => setup(ctx))

  const integrations = [
    options.vscode?.enabled
      ? import('./integrations/vscode').then(({ setup }) => setup(ctx))
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
