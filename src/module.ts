import { join, resolve } from 'path'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'
import { addPlugin, defineNuxtModule } from '@nuxt/kit'
import { tinyws } from 'tinyws'
import type { ViteDevServer } from 'vite'
import sirv from 'sirv'
import { rpcMiddleware } from './middleware'

export interface ModuleOptions {

}

const PATH = '/__nuxt_devtools__'
const PATH_ENTRY = `${PATH}/entry`
const PATH_CLIENT = `${PATH}/client`

const runtimeDir = resolve(fileURLToPath(import.meta.url), '../runtime')
const clientDir = resolve(fileURLToPath(import.meta.url), '../client')

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-devtools',
    configKey: 'devTools',
  },
  defaults: {
  },
  async setup(options, nuxt) {
    if (!nuxt.options.dev)
      return

    addPlugin(join(runtimeDir, 'floating'), {})

    const middleware = rpcMiddleware(nuxt)

    // TODO: support webpack
    nuxt.hook('vite:serverCreated', async (server: ViteDevServer) => {
      server.middlewares.use(PATH_ENTRY, tinyws())
      server.middlewares.use(PATH_ENTRY, middleware)
      if (existsSync(clientDir))
        server.middlewares.use(PATH_CLIENT, sirv(clientDir, { single: true, dev: true }))
    })
  },
})

