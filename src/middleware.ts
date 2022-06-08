import { existsSync } from 'fs'
import type { TinyWSRequest } from 'tinyws'
import type { IncomingMessage, ServerResponse } from 'h3'
import type { WebSocket } from 'ws'
import { createBirpcGroup } from 'birpc'
import type { ChannelOptions } from 'birpc'
import { parse, stringify } from 'flatted'
import { useBody } from 'h3'
import type { Component, Nuxt } from '@nuxt/schema'
import type { Import } from 'unimport'
import { resolvePreset } from 'unimport'
import type { Payload, ServerFunctions } from './types'

export function rpcMiddleware(nuxt: Nuxt) {
  let components: Component[] = []
  let imports: Import[] = []
  let importPresets: Import[] = []
  let payload: Payload = {
    url: '/',
    time: Date.now(),
  }

  nuxt.hook('components:extend', (c) => {
    components = c as Component[]
  })
  nuxt.hook('autoImports:extend', (c) => {
    imports = c
  })
  nuxt.hook('autoImports:sources', (c) => {
    importPresets = c.flatMap(i => resolvePreset(i))
  })

  const serverFunctions: ServerFunctions = {
    getConfig() {
      return nuxt.options
    },
    getComponents() {
      return components
    },
    getAutoImports() {
      return [
        ...imports,
        ...importPresets,
      ]
    },
    getPayload() {
      return payload
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

  const clients = new Set<WebSocket>()
  const birpc = createBirpcGroup(serverFunctions, [])

  return async (req: IncomingMessage & TinyWSRequest, res: ServerResponse) => {
    if (req.ws) {
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
    }
    else {
      if (req.method === 'POST') {
        const body = await useBody(req)
        if (body.method === 'setPayload') {
          payload = parse(body.data)
          res.end()
        }
        else {
          res.statusCode = 400
          res.end()
        }
      }
    }
  }
}
