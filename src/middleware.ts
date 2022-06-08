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
import type { RouteRecordNormalized } from 'vue-router'
import type { ClientFunctions, Payload, ServerFunctions } from './types'

export function rpcMiddleware(nuxt: Nuxt) {
  let components: Component[] = []
  let imports: Import[] = []
  let importPresets: Import[] = []
  let pages: RouteRecordNormalized[] = []
  let payload: Payload = {
    url: '',
    time: Date.now(),
  }

  const serverFunctions: ServerFunctions = {
    getConfig() {
      return nuxt.options
    },
    getComponents() {
      return components
    },
    getPages() {
      return pages
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
        import('launch-editor').then(r => (r.default || r)(file))
    },
  }

  const clients = new Set<WebSocket>()
  const birpc = createBirpcGroup<ClientFunctions>(serverFunctions, [])

  nuxt.hook('components:extend', (v) => {
    components = v as Component[]
    birpc.boardcast.refresh.asEvent('components')
  })
  nuxt.hook('autoImports:extend', (v) => {
    imports = v
    birpc.boardcast.refresh.asEvent('composables')
  })
  nuxt.hook('autoImports:sources', (v) => {
    importPresets = v.flatMap(i => resolvePreset(i))
  })

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
          const prevUrl = payload.url
          payload = parse(body.data)
          if (prevUrl !== payload.url)
            birpc.boardcast.refresh.asEvent('payload')
          res.end()
        }
        else if (body.method === 'setPages') {
          pages = parse(body.data)
          birpc.boardcast.refresh.asEvent('pages')
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
