import type { ViteDevToolsNodeContext } from '@vitejs/devtools-kit'
import type { Nuxt } from 'nuxt/schema'

import type { ModuleOptions, NuxtDevtoolsServerContext, ServerFunctions } from '../types'
import type { PendingHostCalls } from './connect-safe-hosts'
import { deprecate, registerHostDiagnostics } from '@nuxt/devtools-kit'
import { logger } from '@nuxt/kit'
import { colors } from 'consola/utils'
import { setupAnalyzeBuildRPC } from './analyze-build'
import { setupAssetsRPC } from './assets'
import { createConnectSafeHosts, createConnectSafeRpc, flushPendingHostCalls } from './connect-safe-hosts'
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
  let devtoolsKitCtx: ViteDevToolsNodeContext | undefined
  const pendingBroadcasts: { method: string, args: any[] }[] = []
  const pendingHostCalls: PendingHostCalls = []

  // Connect-safe devframe host accessors: forward to `devtoolsKit.*` once
  // connected, buffering mutating calls (replayed on connect) beforehand.
  const hosts = createConnectSafeHosts(() => devtoolsKitCtx, pendingHostCalls)

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

  // `nuxt.devtools.rpc` is the devframe RpcFunctionsHost, exposed connect-safe.
  // The legacy broadcast proxy + `functions` map are kept as deprecated
  // backcompat (NDT_DEP_0007).
  const rpc = createConnectSafeRpc(() => devtoolsKitCtx?.rpc, pendingHostCalls, {
    legacyBroadcast: createBroadcastProxy(),
    legacyFunctions: functionsProxy,
    onLegacyBroadcast: method => deprecate(nuxt, 'NDT_DEP_0007', {
      api: `nuxt.devtools.rpc.broadcast.${method}`,
      replacement: 'nuxt.devtools.rpc.broadcast({ method, args, event })',
    }, { key: `broadcast:${method}` }),
    onLegacyFunctions: () => deprecate(nuxt, 'NDT_DEP_0007', {
      api: 'nuxt.devtools.rpc.functions',
      replacement: 'nuxt.devtools.rpc.register(...) / nuxt.devtools.rpc.invokeLocal(...)',
    }, { key: 'functions' }),
  })

  function refresh(event: keyof ServerFunctions) {
    broadcast('refresh', event)
  }

  function extendServerRpc(namespace: string, functions: any): any {
    deprecate(nuxt, 'NDT_DEP_0003', {
      api: 'extendServerRpc',
      replacement: 'nuxt.devtools.rpc.register(defineRpcFunction(...))',
    }, { key: namespace })

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
    rpc,
    get devtoolsKit() { return devtoolsKitCtx },
    docks: hosts.docks,
    terminals: hosts.terminals,
    messages: hosts.messages,
    commands: hosts.commands,
    diagnostics: hosts.diagnostics,
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
  async function connectDevToolsKit(kitCtx: ViteDevToolsNodeContext) {
    /**
     * guarded to keep the first connection (client Vite), since Nuxt creates
     * two Vite instances and the second (server) one has 0 WebSocket clients.
     * If we don't guard this, the server connection will overwrite the client connection and break all RPC calls from server to client.
     */
    if (devtoolsKitCtx)
      return
    devtoolsKitCtx = kitCtx
    const host = kitCtx.rpc

    // Flush any broadcasts that were queued before connection
    for (const { method, args } of pendingBroadcasts) {
      broadcast(method, ...args)
    }
    pendingBroadcasts.length = 0

    // Replay connect-safe host mutations buffered before connection.
    flushPendingHostCalls(pendingHostCalls)

    // Register the Nuxt deprecation codes into the DevTools diagnostics host so
    // post-connect deprecations also surface in the DevTools UI.
    registerHostDiagnostics(ctx)

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

    // Signal that the DevTools kit is connected and ready. This is the
    // recommended place for modules to do their DevTools integration.
    await nuxt.callHook('devtools:ready', kitCtx)
  }

  return {
    connectDevToolsKit,
    ...ctx,
  }
}
