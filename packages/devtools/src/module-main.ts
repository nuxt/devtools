import { join } from 'node:path'
import { existsSync } from 'node:fs'
import type { Nuxt } from 'nuxt/schema'
import { addPlugin, logger } from '@nuxt/kit'
import { tinyws } from 'tinyws'
import type { ViteDevServer } from 'vite'
import { searchForWorkspaceRoot } from 'vite'
import sirv from 'sirv'
import c from 'picocolors'
import { version } from '../package.json'
import type { ModuleOptions } from './types'
import { setupRPC } from './server-rpc'
import { clientDir, isGlobalInstall, packageDir, runtimeDir } from './dirs'
import { ROUTE_CLIENT, ROUTE_ENTRY } from './constant'

export async function enableModule(options: ModuleOptions, nuxt: Nuxt) {
  // Disable in test mode
  if (process.env.TEST || process.env.NODE_ENV === 'test')
    return

  // TODO: Support devtools in production
  if (!nuxt.options.dev)
    return

  if (nuxt.options.builder !== '@nuxt/vite-builder') {
    logger.warn('Nuxt Devtools only supports Vite mode, module is disabled.')
    return
  }

  await nuxt.callHook('devtools:before')

  nuxt.options.imports.collectMeta = true

  addPlugin({
    src: join(runtimeDir, 'plugins/devtools.client'),
    mode: 'client',
  })

  const {
    middleware: rpcMiddleware,
    ...ctx
  } = setupRPC(nuxt, options)

  const clientDirExists = existsSync(clientDir)

  nuxt.hook('vite:extendConfig', (config) => {
    config.server ||= {}
    config.server.fs ||= {}
    config.server.fs.allow ||= [
      searchForWorkspaceRoot(process.cwd()),
    ]
    config.server.fs.allow.push(packageDir)
  })

  // TODO: Use WS from nitro server when possible
  nuxt.hook('vite:serverCreated', (server: ViteDevServer) => {
    server.middlewares.use(ROUTE_ENTRY, tinyws() as any)
    server.middlewares.use(ROUTE_ENTRY, rpcMiddleware as any)
    // serve the front end in production
    if (clientDirExists)
      server.middlewares.use(ROUTE_CLIENT, sirv(clientDir, { single: true, dev: true }))
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
  ]

  await Promise.all(integrations)

  await nuxt.callHook('devtools:initialized')

  logger.success(`Nuxt Devtools is enabled ${c.dim(`v${version}`)}${isGlobalInstall() ? c.dim('[global]') : ''} ${c.yellow('(experimental)')}`)
}
