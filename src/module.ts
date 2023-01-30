import { join } from 'path'
import { existsSync } from 'fs'
import { addPlugin, defineNuxtModule, logger } from '@nuxt/kit'
import { tinyws } from 'tinyws'
import type { ViteDevServer } from 'vite'
import sirv from 'sirv'
import c from 'picocolors'
import { setupRPC } from './rpc'
import type { ModuleCustomTab } from './types'
import { clientDir, runtimeDir } from './dirs'

declare module '@nuxt/schema' {
  interface NuxtHooks {
    /**
     * Called before devtools starts. Useful to detect if devtools is enabled.
     */
    'devtools:before': () => void

    /**
     * Called after devtools is initialized.
     */
    'devtools:initialized': () => void

    /**
     * Hooks to extend devtools tabs.
     */
    'devtools:customTabs': (tabs: ModuleCustomTab[]) => void

    /**
     * Retrigger update for custom tabs, `devtools:customTabs` will be called again.
     */
    'devtools:customTabs:refresh': () => void
  }
}

export interface ModuleOptions {
  /**
   * Enable custom tabs.
   * @default true
   */
  enableCustomTabs?: boolean

  // MOVE TO VIEW
  /**
   * Start a VS Code server locally, and integrate with the devtools.
   * You may need to apply and install VS Code server first.
   *
   * @see https://code.visualstudio.com/blogs/2022/07/07/vscode-server
   * @default false
   */
  // vscodeServer?: boolean
}

const PATH = '/__nuxt_devtools__'
const PATH_ENTRY = `${PATH}/entry`
const PATH_CLIENT = `${PATH}/client`

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@nuxt/devtools',
    configKey: 'devtools',
  },
  defaults: {
    enableCustomTabs: true,
  },
  async setup(options, nuxt) {
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
      initHooks,
      serverFunctions,
    } = setupRPC(nuxt, options)

    // TODO: Use WS from nitro server when possible
    nuxt.hook('vite:serverCreated', (server: ViteDevServer) => {
      server.middlewares.use(PATH_ENTRY, tinyws() as any)
      server.middlewares.use(PATH_ENTRY, rpcMiddleware as any)
      // serve the front end in production
      if (existsSync(clientDir))
        server.middlewares.use(PATH_CLIENT, sirv(clientDir, { single: true, dev: true }))
    })

    const integrations = [
      import('./integrations/vue-inspector').then(({ setup }) => setup(nuxt, serverFunctions)),
      import('./integrations/vite-inspect').then(({ setup }) => setup(nuxt, serverFunctions)),
      import('./integrations/vscode').then(({ setup }) => setup(nuxt, serverFunctions)),
    ]

    await Promise.all(integrations)

    nuxt.hook('app:resolve', async () => {
      await initHooks()
    })

    await nuxt.callHook('devtools:initialized')

    logger.success(`Nuxt Devtools is enabled ${c.yellow('(experimental)')}`)
  },
})
