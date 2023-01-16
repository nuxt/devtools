import { join, resolve } from 'path'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'
import { addPlugin, addVitePlugin, defineNuxtModule, logger } from '@nuxt/kit'
import { tinyws } from 'tinyws'
import type { ViteDevServer } from 'vite'
import sirv from 'sirv'
import { setupRPC } from './rpc'
import type { ModuleIframeTab } from './types'

export interface ModuleOptions {
  /**
   * Start a VS Code server locally, and integrate with the devtools.
   * You may need to apply and install VS Code server first.
   *
   * @see https://code.visualstudio.com/blogs/2022/07/07/vscode-server
   * @default false
   */
  vscodeServer?: boolean
}

declare module '@nuxt/schema' {
  interface NuxtHooks {
    'devtools:customTabs': (tabs: ModuleIframeTab[]) => void
  }
}

const PATH = '/__nuxt_devtools__'
const PATH_ENTRY = `${PATH}/entry`
const PATH_CLIENT = `${PATH}/client`

const runtimeDir = resolve(fileURLToPath(import.meta.url), '../runtime')
const clientDir = resolve(fileURLToPath(import.meta.url), '../client')

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@nuxt/devtools',
    configKey: 'devtools',
  },
  defaults: {
    vscodeServer: false,
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

    nuxt.options.imports.collectMeta = true

    addPlugin(join(runtimeDir, 'plugins/devtools-client'), {})

    const {
      middleware: rpcMiddleware,
      initHooks,
    } = setupRPC(nuxt)

    // TODO: Use WS from nitro server when possible
    nuxt.hook('vite:serverCreated', (server: ViteDevServer) => {
      server.middlewares.use(PATH_ENTRY, tinyws() as any)
      server.middlewares.use(PATH_ENTRY, rpcMiddleware as any)
      // serve the front end in production
      if (existsSync(clientDir))
        server.middlewares.use(PATH_CLIENT, sirv(clientDir, { single: true, dev: true }))
    })

    if (nuxt.options.builder === '@nuxt/vite-builder') {
      if (nuxt.options.dev) {
        addVitePlugin(await import('vite-plugin-vue-inspector').then(r => r.default({
          appendTo: 'entry.mjs',
          toggleComboKey: '',
          toggleButtonVisibility: 'never',
        })) as any)
      }
    }

    await import('./integrations/vite-inspect').then(({ setupViteInspect }) => setupViteInspect(nuxt))
    if (options.vscodeServer)
      await import('./integrations/vscode').then(({ setupVSCodeServer }) => setupVSCodeServer(nuxt))

    nuxt.hook('app:resolve', async () => {
      await initHooks()
    })

    logger.success('Nuxt Devtools is enabled.')
  },
})
