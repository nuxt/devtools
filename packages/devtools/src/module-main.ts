import type {} from '@vitejs/devtools-kit'
import type { ServerResponse } from 'node:http'
import type { Nuxt } from 'nuxt/schema'
import type { ViteDevServer } from 'vite'
import type { ModuleOptions, NuxtDevToolsOptions } from './types'
import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import os from 'node:os'
import { addImports, addPlugin, addTemplate, addVitePlugin, extendViteConfig, logger } from '@nuxt/kit'
import { colors } from 'consola/utils'
import { join } from 'pathe'
import sirv from 'sirv'
import { searchForWorkspaceRoot } from 'vite'
import { version } from '../package.json'
import { defaultTabOptions } from './constant'
import { getDevAuthToken } from './dev-auth'
import { clientDir, isGlobalInstall, packageDir, runtimeDir } from './dirs'
import { setupRPC } from './server-rpc'
import { readLocalOptions } from './utils/local-options'

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

  // Determine if user aware devtools, by checking the presentation in the config
  const enabledExplicitly = (nuxt.options.devtools === true)
    || (nuxt.options.devtools && nuxt.options.devtools.enabled)
    || !!nuxt.options.modules.find(m => m === '@nuxt/devtools' || m === '@nuxt/devtools-edge' || m === '@nuxt/devtools-nightly')

  await nuxt.callHook('devtools:before')

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

  if (options.viteDevTools) {
    // eslint-disable-next-line no-console
    console.log('[nuxt-devtools] Enabling experimental Vite DevTools integration')
    addVitePlugin({
      name: 'nuxt:devtools',
      devtools: {
        setup(ctx) {
          ctx.docks.register({
            id: 'nuxt:devtools',
            type: 'iframe',
            icon: 'https://nuxt.com/assets/design-kit/icon-green.svg',
            title: 'Nuxt DevTools',
            url: '/__nuxt_devtools__/client/',
          })
        },
      },
    })
    // TODO: disable builtin devtools panel for vite devtools
  }

  // Mainly for the injected runtime plugin to access the settings
  // Usage `import settings from '#build/devtools/settings'`
  addTemplate({
    filename: 'devtools/settings.mjs',
    async getContents() {
      const uiOptions = await readLocalOptions<NuxtDevToolsOptions['ui']>(
        {
          ...defaultTabOptions.ui,
          // When not enabled explicitly, we hide the panel by default
          showPanel: enabledExplicitly ? true : null,
        },
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
      defaultTabOptions.serverTasks.enabled = true

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

  const {
    vitePlugin,
    ...ctx
  } = setupRPC(nuxt, options)

  addVitePlugin(vitePlugin)

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

  const ROUTE_PATH = `${nuxt.options.app.baseURL || '/'}/__nuxt_devtools__`.replace(/\/+/g, '/')
  const ROUTE_CLIENT = `${ROUTE_PATH}/client`
  const ROUTE_AUTH = `${ROUTE_PATH}/auth`
  const ROUTE_AUTH_VERIFY = `${ROUTE_PATH}/auth-verify`
  const ROUTE_ANALYZE = `${ROUTE_PATH}/analyze`

  // TODO: Use WS from nitro server when possible
  nuxt.hook('vite:serverCreated', (server: ViteDevServer) => {
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
        res.write((await indexContent).replace(/\/__NUXT_DEVTOOLS_BASE__\//g, `${ROUTE_CLIENT}/`))
        res.end()
      }
      server.middlewares.use(ROUTE_CLIENT, (req, res) => {
        if (req.url === '/')
          return handleIndex(res)
        return handleStatic(req, res, () => handleIndex(res))
      })
    }
    server.middlewares.use(ROUTE_AUTH, sirv(join(runtimeDir, 'auth'), { single: true, dev: true }))
    server.middlewares.use(ROUTE_AUTH_VERIFY, async (req, res) => {
      const search = req.url?.split('?')[1]
      if (!search) {
        res.statusCode = 400
        res.end('No token provided')
      }
      const query = new URLSearchParams(search)
      const token = query.get('token')
      if (!token) {
        res.statusCode = 400
        res.end('No token provided')
      }
      if (token === await getDevAuthToken()) {
        res.statusCode = 200
        res.end('Valid token')
      }
      else {
        res.statusCode = 403
        res.end('Invalid token')
      }
    })
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

  await nuxt.callHook('devtools:initialized', {
    version,
    packagePath: packageDir,
    isGlobalInstall: isGlobalInstall(),
  })

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
