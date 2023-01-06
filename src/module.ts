import { join, resolve } from 'path'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'
import { addPlugin, addVitePlugin, defineNuxtModule } from '@nuxt/kit'
import { tinyws } from 'tinyws'
import type { ViteDevServer } from 'vite'
import sirv from 'sirv'
import { setupRPC } from './rpc'
import type { ModuleIframeTab } from './types'

export interface ModuleOptions {

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
  },
  async setup(_options, nuxt) {
    // TODO: Support devtools in production
    if (!nuxt.options.dev)
      return

    addPlugin(join(runtimeDir, 'plugins/devtools-ui'), {})

    const {
      middleware: rpcMiddleware,
      initHooks,
    } = setupRPC(nuxt)

    // TODO: Use WS from nitro server when possible
    nuxt.hook('vite:serverCreated', (server: ViteDevServer) => {
      server.middlewares.use(PATH_ENTRY, tinyws() as any)
      server.middlewares.use(PATH_ENTRY, rpcMiddleware as any)
      if (existsSync(clientDir))
        server.middlewares.use(PATH_CLIENT, sirv(clientDir, { single: true, dev: true }))
    })

    if (nuxt.options.builder === '@nuxt/vite-builder')
      addVitePlugin(await import('vite-plugin-inspect').then(r => (r.default || r)()))

    await initHooks()
  },
})
