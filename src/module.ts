import { join, resolve } from 'path'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'
import { addPlugin, defineNuxtModule } from '@nuxt/kit'
import type { TinyWSRequest } from 'tinyws'
import { tinyws } from 'tinyws'
import type { ViteDevServer } from 'vite'
import type { IncomingMessage } from 'h3'
import type { WebSocket } from 'ws'
import sirv from 'sirv'

export interface ModuleOptions {

}

const PATH = '/__nuxt_devtools__'
const PATH_WS = `${PATH}/ws`
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

    const clients = new Set<WebSocket>()

    addPlugin(join(runtimeDir, 'float.plugin'), {})

    // TODO: support webpack
    nuxt.hook('vite:serverCreated', async (server: ViteDevServer) => {
      server.middlewares.use(PATH_WS, tinyws())
      server.middlewares.use(PATH_WS, async (req: IncomingMessage & TinyWSRequest, res) => {
        if (!req.ws) {
          res.write(JSON.stringify({ msg: 'not a websocket request' }))
          res.statusCode = 400
          res.end()
          return
        }

        const ws = await req.ws()
        clients.add(ws)
        ws.send('Hello')
      })

      if (existsSync(clientDir)) {
        server.middlewares.use(PATH_CLIENT, sirv(clientDir, {
          single: true,
          dev: true,
        }))
      }
    })
  },
})
