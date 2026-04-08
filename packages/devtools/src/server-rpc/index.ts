import type { DevToolsNodeContext } from '@vitejs/devtools-kit'
import type { Nuxt } from 'nuxt/schema'

import type { ModuleOptions, NuxtDevtoolsServerContext, ServerFunctions } from '../types'
import { logger } from '@nuxt/kit'
import { colors } from 'consola/utils'
import { setupAnalyzeBuildRPC } from './analyze-build'
import { setupAssetsRPC } from './assets'
import { setupCustomTabRPC } from './custom-tabs'
import { setupGeneralRPC } from './general'
import { setupNpmRPC } from './npm'
import { setupOptionsRPC } from './options'
import { setupServerDataRPC } from './server-data'
import { setupServerRoutesRPC } from './server-routes'
import { setupServerTasksRPC } from './server-tasks'
import { setupStorageRPC } from './storage'
import { setupTelemetryRPC } from './telemetry'
import { setupTerminalRPC } from './terminals'
import { setupTimelineRPC } from './timeline'

export function setupRPC(nuxt: Nuxt, options: ModuleOptions) {
  const serverFunctions = {} as ServerFunctions
  const extendedRpcMap = new Map<string, Record<string, (...args: any[]) => any>>()
  let devtoolsKitCtx: DevToolsNodeContext | undefined
  const pendingBroadcasts: { method: string, args: any[] }[] = []

  function broadcast(method: string, ...args: any[]) {
    if (!devtoolsKitCtx) {
      pendingBroadcasts.push({ method, args })
      return
    }
    devtoolsKitCtx.rpc.broadcast({
      method: method as any,
      args: args as any,
      event: true,
    })
  }

  /**
   * Compatibility broadcast proxy that supports the old birpc-style API:
   * `rpc.broadcast.refresh.asEvent(event)` and `rpc.broadcast.onTerminalData.asEvent({ id, data })`
   */
  function createBroadcastProxy(prefix = ''): any {
    return new Proxy({}, {
      get: (_, method) => {
        if (typeof method !== 'string')
          return
        const fullMethod = prefix ? `${prefix}:${method}` : method
        const fn = (...args: any[]) => broadcast(fullMethod, ...args)
        fn.asEvent = (...args: any[]) => broadcast(fullMethod, ...args)
        return fn
      },
    })
  }

  /**
   * Compatibility proxy for `rpc.functions` that reads/writes to serverFunctions
   * and also updates the RpcFunctionsHost when available.
   */
  const functionsProxy = new Proxy(serverFunctions, {
    set(target, prop, value) {
      (target as any)[prop] = value
      // Also update on RpcFunctionsHost if available
      if (devtoolsKitCtx && typeof prop === 'string') {
        if (devtoolsKitCtx.rpc.has(prop)) {
          devtoolsKitCtx.rpc.update({ name: prop, handler: value })
        }
        else {
          devtoolsKitCtx.rpc.register({ name: prop, handler: value })
        }
      }
      return true
    },
  })

  const rpc = {
    broadcast: createBroadcastProxy(),
    functions: functionsProxy,
  }

  function refresh(event: keyof ServerFunctions) {
    broadcast('refresh', event)
  }

  function extendServerRpc(namespace: string, functions: any): any {
    extendedRpcMap.set(namespace, functions)

    // Register on RpcFunctionsHost if already available
    if (devtoolsKitCtx) {
      for (const [fnName, handler] of Object.entries(functions)) {
        if (typeof handler === 'function') {
          devtoolsKitCtx.rpc.register({ name: `${namespace}:${fnName}`, handler: handler as any })
        }
      }
    }

    return {
      broadcast: createBroadcastProxy(namespace),
      functions,
      clients: [],
      updateChannels: () => [],
    }
  }

  const ctx: NuxtDevtoolsServerContext = {
    nuxt,
    options,
    rpc: rpc as any,
    get devtoolsKit() { return devtoolsKitCtx },
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
    ...setupTerminalRPC(ctx),
    ...setupServerRoutesRPC(ctx),
    ...setupServerTasksRPC(ctx),
    ...setupAnalyzeBuildRPC(ctx),
    ...setupOptionsRPC(ctx),
    ...setupTimelineRPC(ctx),
    ...setupTelemetryRPC(ctx),
    ...setupServerDataRPC(ctx),
  } as ServerFunctions)

  /**
   * Connect to Vite DevTools Kit context.
   * Called from the Vite DevTools plugin setup callback.
   */
  function connectDevToolsKit(ctx: DevToolsNodeContext) {
    /**
     * guarded to keep the first connection (client Vite), since Nuxt creates
     * two Vite instances and the second (server) one has 0 WebSocket clients.
     * If we don't guard this, the server connection will overwrite the client connection and break all RPC calls from server to client.
     */
    if (devtoolsKitCtx)
      return
    devtoolsKitCtx = ctx
    const host = ctx.rpc

    // Flush any broadcasts that were queued before connection
    for (const { method, args } of pendingBroadcasts) {
      broadcast(method, ...args)
    }
    pendingBroadcasts.length = 0

    // Register all collected server functions
    for (const [name, handler] of Object.entries(serverFunctions)) {
      if (typeof handler === 'function') {
        try {
          host.register({
            name,
            handler: handler as any,
          })
        }
        catch (e) {
          logger.warn(
            colors.yellow(`[nuxt-devtools] Failed to register RPC function "${name}":\n`)
            + colors.red((e as Error)?.message || ''),
          )
        }
      }
    }

    // Register extended (namespaced) functions
    for (const [namespace, fns] of extendedRpcMap) {
      for (const [fnName, handler] of Object.entries(fns)) {
        if (typeof handler === 'function') {
          try {
            host.register({
              name: `${namespace}:${fnName}`,
              handler: handler as any,
            })
          }
          catch (e) {
            logger.warn(
              colors.yellow(`[nuxt-devtools] Failed to register RPC function "${namespace}:${fnName}":\n`)
              + colors.red((e as Error)?.message || ''),
            )
          }
        }
      }
    }
  }

  return {
    connectDevToolsKit,
    ...ctx,
  }
}
