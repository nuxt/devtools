import type { WebSocket } from 'ws'
import { createBirpcGroup } from 'birpc'
import type { ChannelOptions } from 'birpc'

import { parse, stringify } from 'flatted'
import type { Nuxt } from 'nuxt/schema'
import type { Plugin } from 'vite'
import type { ClientFunctions, ModuleOptions, NuxtDevtoolsServerContext, ServerFunctions } from '../types'
import { WS_EVENT_NAME } from '../constant'
import { setupStorageRPC } from './storage'
import { setupAssetsRPC } from './assets'
import { setupNpmRPC } from './npm'
import { setupCustomTabRPC } from './custom-tabs'
import { setupGeneralRPC } from './general'
import { setupWizardRPC } from './wizard'
import { setupTerminalRPC } from './terminals'
import { setupServerRoutesRPC } from './server-routes'
import { setupAnalyzeBuildRPC } from './analyze-build'
import { setupUIOptionsRPC } from './ui-options'

export function setupRPC(nuxt: Nuxt, options: ModuleOptions) {
  const serverFunctions = {} as ServerFunctions
  const extendedRpcMap = new Map<string, any>()
  const rpc = createBirpcGroup<ClientFunctions, ServerFunctions>(
    serverFunctions,
    [],
    {
      resolver: (name, fn) => {
        if (fn)
          return fn

        if (!name.includes(':'))
          return

        const [namespace, fnName] = name.split(':')
        return extendedRpcMap.get(namespace)?.[fnName]
      },
      onError(error, name) {
        console.error(`[nuxt-devtools] RPC error on executing "${name}":`, error)
      },
      timeout: 120_000,
    },
  )

  function refresh(event: keyof ServerFunctions) {
    rpc.broadcast.refresh.asEvent(event)
  }

  function extendServerRpc(namespace: string, functions: any): any {
    extendedRpcMap.set(namespace, functions)

    return {
      broadcast: new Proxy({}, {
        get: (_, key) => {
          if (typeof key !== 'string')
            return
          return (rpc.broadcast as any)[`${namespace}:${key}`]
        },
      }),
    }
  }

  const ctx: NuxtDevtoolsServerContext = {
    nuxt,
    options,
    rpc,
    refresh,
    extendServerRpc,
    openInEditorHooks: [],
  }

  // @ts-expect-error untyped
  nuxt.devtools = ctx

  Object.assign(serverFunctions, {
    ...setupGeneralRPC(ctx),
    ...setupCustomTabRPC(ctx),
    ...setupStorageRPC(ctx),
    ...setupAssetsRPC(ctx),
    ...setupNpmRPC(ctx),
    ...setupWizardRPC(ctx),
    ...setupTerminalRPC(ctx),
    ...setupServerRoutesRPC(ctx),
    ...setupAnalyzeBuildRPC(ctx),
    ...setupUIOptionsRPC(ctx),
  } satisfies ServerFunctions)

  const wsClients = new Set<WebSocket>()

  const vitePlugin: Plugin = {
    name: 'nuxt:devtools:rpc',
    configureServer(server) {
      server.ws.on('connection', (ws) => {
        wsClients.add(ws)
        const channel: ChannelOptions = {
          post: d => ws.send(JSON.stringify({
            type: 'custom',
            event: WS_EVENT_NAME,
            data: d,
          })),
          on: (fn) => {
            ws.on('message', (e) => {
              try {
                const data = JSON.parse(String(e)) || {}
                if (data.type === 'custom' && data.event === WS_EVENT_NAME) {
                  // console.log(data.data)
                  fn(data.data)
                }
              }
              catch {}
            })
          },
          serialize: stringify,
          deserialize: parse,
        }
        rpc.updateChannels((c) => {
          c.push(channel)
        })
        ws.on('close', () => {
          wsClients.delete(ws)
          rpc.updateChannels((c) => {
            const index = c.indexOf(channel)
            if (index >= 0)
              c.splice(index, 1)
          })
        })
      })
    },
  }

  return {
    vitePlugin,
    ...ctx,
  }
}
