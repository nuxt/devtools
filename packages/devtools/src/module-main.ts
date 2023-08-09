import { existsSync } from 'node:fs'
import { join } from 'pathe'
import type { Nuxt } from 'nuxt/schema'
import { addPlugin, addVitePlugin, logger } from '@nuxt/kit'
import type { ViteDevServer } from 'vite'
import { searchForWorkspaceRoot } from 'vite'
import sirv from 'sirv'
import c from 'picocolors'
import { version } from '../package.json'
import type { ModuleOptions } from './types'
import { setupRPC } from './server-rpc'
import { clientDir, isGlobalInstall, packageDir, runtimeDir } from './dirs'
import { ROUTE_ANALYZE, ROUTE_AUTH, ROUTE_AUTH_VERIFY, ROUTE_CLIENT } from './constant'
import { getDevAuthToken } from './dev-auth'

export async function enableModule(options: ModuleOptions, nuxt: Nuxt) {
  // Disable in test mode
  if (process.env.TEST || process.env.NODE_ENV === 'test')
    return

  if (nuxt.options.builder !== '@nuxt/vite-builder') {
    logger.warn('Nuxt DevTools only supports Vite mode, module is disabled.')
    return
  }

  if (!nuxt.options.dev) {
    if (nuxt.options.build.analyze)
      await import('./integrations/analyze-build').then(({ setup }) => setup(nuxt, options))
    return
  }

  await nuxt.callHook('devtools:before')

  nuxt.options.imports.collectMeta = true

  addPlugin({
    src: join(runtimeDir, 'plugins/devtools.client'),
    mode: 'client',
  })

  addPlugin({
    src: join(runtimeDir, 'plugins/devtools.server'),
    mode: 'server',
  })

  // Inject inline script
  nuxt.hook('nitro:config', (config) => {
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
    config.plugins.push(join(runtimeDir, 'nitro/inline'))
  })

  const {
    vitePlugin,
    ...ctx
  } = setupRPC(nuxt, options)

  addVitePlugin(vitePlugin)

  const clientDirExists = existsSync(clientDir)
  const analyzeDir = join(nuxt.options.rootDir, '.nuxt/analyze')

  nuxt.hook('vite:extendConfig', (config) => {
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
  })

  nuxt.hook('imports:extend', (imports) => {
    imports.push({
      name: 'useNuxtDevTools',
      from: join(runtimeDir, 'use-nuxt-devtools'),
    })
  })

  // TODO: Use WS from nitro server when possible
  nuxt.hook('vite:serverCreated', (server: ViteDevServer) => {
    server.middlewares.use(ROUTE_ANALYZE, sirv(analyzeDir, { single: false, dev: true }))
    // serve the front end in production
    if (clientDirExists)
      server.middlewares.use(ROUTE_CLIENT, sirv(clientDir, { single: true, dev: true }))
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

  const integrations = [
    import('./integrations/plugin-metrics').then(({ setup }) => setup(ctx)),
    options.viteInspect !== false
      ? import('./integrations/vite-inspect').then(({ setup }) => setup(ctx))
      : null,
    options.componentInspector !== false
      ? import('./integrations/vue-inspector').then(({ setup }) => setup(ctx))
      : null,
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

  logger.success(`Nuxt DevTools is enabled ${c.dim(`v${version}`)}${isGlobalInstall() ? c.dim('[global]') : ''} ${c.yellow('(experimental)')}`)
}
