import type { TinyWSRequest } from 'tinyws'
import type { NodeIncomingMessage, NodeServerResponse } from 'h3'
import type { WebSocket } from 'ws'
import { createBirpcGroup } from 'birpc'
import type { ChannelOptions } from 'birpc'

import { parse, stringify } from 'flatted'
import type { Nuxt } from 'nuxt/schema'
import type { ClientFunctions, ModuleOptions, ServerFunctions } from '../types'
import { setupStorageRPC } from './storage'
import { setupAssetsRPC } from './assets'
import { setupNpmRPC } from './npm'
import { setupCustomTabRPC } from './custom-tabs'
import { setupGeneralRPC } from './general'
import { setupWizardRPC } from './wizard'
import type { RPCContext } from './types'
import { setupTerminalRPC } from './terminal'

export function setupRPC(nuxt: Nuxt, options: ModuleOptions) {
  const serverFunctions = {} as ServerFunctions
  const birpc = createBirpcGroup<ClientFunctions, ServerFunctions>(serverFunctions, [])

  function refresh(event: keyof ServerFunctions) {
    birpc.broadcast.refresh.asEvent(event)
  }

  const ctx: RPCContext = {
    nuxt,
    options,
    birpc,
    refresh,
  }

  Object.assign(serverFunctions, {
    ...setupGeneralRPC(ctx),
    ...setupCustomTabRPC(ctx),
    ...setupStorageRPC(ctx),
    ...setupAssetsRPC(ctx),
    ...setupNpmRPC(ctx),
    ...setupWizardRPC(ctx),
    ...setupTerminalRPC(ctx),
  } satisfies ServerFunctions)

  const wsClients = new Set<WebSocket>()
  const middleware = async (req: NodeIncomingMessage & TinyWSRequest, _res: NodeServerResponse, next: Function) => {
    // Handle WebSocket
    if (req.ws) {
      const ws = await req.ws()
      wsClients.add(ws)
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
        wsClients.delete(ws)
        birpc.updateChannels((c) => {
          const index = c.indexOf(channel)
          if (index >= 0)
            c.splice(index, 1)
        })
      })
    }
    else {
      next()
    }
  }

  return {
    middleware,
    ...ctx,
  }
}
