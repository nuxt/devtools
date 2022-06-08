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
import type { ChannelOptions } from 'birpc'
import { createBirpcGroup } from 'birpc'
import { parse, stringify } from 'flatted'
import type { Component } from '@nuxt/schema'
import type { Import } from 'unimport'
import type { ServerFunctions } from './types'

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

    let components: Component[] = []
    let imports: Import[] = []

    nuxt.hook('components:extend', (c: Component[]) => {
      components = c
    })
    nuxt.hook('autoImports:extend', (c) => {
      imports = c
    })

    const serverFunctions: ServerFunctions = {
      getConfig() {
        return nuxt.options
      },
      getComponents() {
        return components
      },
      getAutoImports() {
        return imports
      },
      async openInEditor(filepath: string) {
        const file = [
          filepath,
          `${filepath}.js`,
          `${filepath}.mjs`,
          `${filepath}.ts`,
        ].find(i => existsSync(i))
        if (file)
          import('launch-editor').then(r => r(file))
      },
    }

    const birpc = createBirpcGroup(serverFunctions, [])

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
        const channel: ChannelOptions = {
          post: d => ws.send(d),
          on: fn => ws.on('message', fn),
          serialize: stringify,
          deserialize: parse,
        }
        birpc.updateChannels((c) => {
          c.push(channel)
        })
        ws.on('close', () => {
          clients.delete(ws)
          birpc.updateChannels((c) => {
            const index = c.indexOf(channel)
            if (index >= 0)
              c.splice(index, 1)
          })
        })
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
