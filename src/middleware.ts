import type { TinyWSRequest } from 'tinyws'
import type { IncomingMessage, ServerResponse } from 'h3'
import type { WebSocket } from 'ws'
import { createBirpcGroup } from 'birpc'
import type { ChannelOptions } from 'birpc'
import { parse, stringify } from 'flatted'
import type { Nuxt } from '@nuxt/schema'
import { createServerFunctions } from './functions'

export function rpcMiddleware(nuxt: Nuxt) {
  const clients = new Set<WebSocket>()
  const birpc = createBirpcGroup(createServerFunctions(nuxt), [])

  return async (req: IncomingMessage & TinyWSRequest, res: ServerResponse) => {
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
  }
}
