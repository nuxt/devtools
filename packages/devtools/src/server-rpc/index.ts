import type { ViteDevToolsNodeContext } from '@vitejs/devtools-kit'
import type { Nuxt } from 'nuxt/schema'

import type { ModuleOptions, NuxtDevtoolsServerContext, ServerFunctions } from '../types'
import { deprecate, registerHostDiagnostics } from '@nuxt/devtools-kit'
import { logger } from '@nuxt/kit'
import { colors } from 'consola/utils'
import { RPC_NAMESPACE } from '../rpc-namespace'
import { setupAnalyzeBuildRPC } from './analyze-build'
import { setupAssetsRPC } from './assets'
import { setupCustomTabRPC } from './custom-tabs'
import { setupGeneralRPC } from './general'
import { createNotifier, setupMessagesRPC } from './messages'
import { setupNpmRPC } from './npm'
import { setupOptionsRPC } from './options'
import { setupServerDataRPC } from './server-data'
import { setupServerRoutesRPC } from './server-routes'
import { setupServerTasksRPC } from './server-tasks'
import { skipInSSR } from './skip-in-ssr'
import { setupStorageRPC } from './storage'
import { setupTelemetryRPC } from './telemetry'
import { setupTerminalsBridge } from './terminals'
import { setupTimelineRPC } from './timeline'

export function setupRPC(nuxt: Nuxt, options: ModuleOptions) {
  const serverFunctions = {} as ServerFunctions
  const extendedRpcMap = new Map<string, Record<string, (...args: any[]) => any>>()
  let devtoolsKitCtx: ViteDevToolsNodeContext | undefined
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
   * `rpc.broadcast.refresh.asEvent(event)` and `rpc.broadcast.onTerminalExit.asEvent({ id, code })`
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

  // Legacy `nuxt.devtools.rpc` compatibility surface. Direct access to
  // `broadcast` / `functions` is deprecated (NDT_DEP_0007) — new integrations
  // should use the connected `ctx.rpc` from the `devtools:ready` hook instead.
  const rpc = new Proxy({
    broadcast: createBroadcastProxy(),
    functions: functionsProxy,
  }, {
    get(target, prop, receiver) {
      if (prop === 'broadcast' || prop === 'functions') {
        deprecate(nuxt, 'NDT_DEP_0007', {
          api: `nuxt.devtools.rpc.${prop}`,
          replacement: 'the connected ctx.rpc from onDevtoolsReady((ctx) => ...)',
        }, { key: prop })
      }
      return Reflect.get(target, prop, receiver)
    },
  })

  function refresh(event: keyof ServerFunctions) {
    broadcast('refresh', event)
  }

  // Notify machinery: forwards notifications into the connected `ctx.messages`
  // host, buffering any emitted before the kit connects. Registers the
  // `devtools:notify` hook. Exposed on the context as `ctx.notify` for the
  // curated built-in notification sources.
  const notify = createNotifier(nuxt)

  function extendServerRpc(namespace: string, functions: any): any {
    deprecate(nuxt, 'NDT_DEP_0003', {
      api: 'extendServerRpc',
      replacement: 'onDevtoolsReady((ctx) => ctx.rpc.register(defineRpcFunction(...)))',
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
    refresh,
    notify,
    extendServerRpc,
    openInEditorHooks: [],
  }

  // @ts-expect-error untyped
  nuxt.devtools = ctx

  Object.assign(serverFunctions, {
    ...setupGeneralRPC(ctx),
    ...setupMessagesRPC(ctx),
    ...setupCustomTabRPC(ctx),
    ...setupStorageRPC(ctx),
    ...setupAssetsRPC(ctx),
    ...setupNpmRPC(ctx),
    // Bridge the `devtools:terminal:*` hooks onto the Vite DevTools terminals
    // host so module terminals surface in the built-in Terminals dock. Also
    // registers its own hook listeners (including `devtools:ready`) as a side
    // effect, and contributes the `revealTerminal` RPC.
    ...setupTerminalsBridge(ctx),
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
   *
   * Nuxt creates two Vite instances (client and SSR); only the browser-serving
   * client instance has WebSocket peers, so we skip the SSR candidate (see
   * `skipInSSR`) rather than relying on setup order.
   */
  async function connectDevToolsKit(kitCtx: ViteDevToolsNodeContext) {
    if (devtoolsKitCtx || skipInSSR(kitCtx))
      return

    devtoolsKitCtx = kitCtx
    const host = kitCtx.rpc

    // Flush any broadcasts that were queued before connection
    for (const { method, args } of pendingBroadcasts) {
      broadcast(method, ...args)
    }
    pendingBroadcasts.length = 0

    // Register the Nuxt deprecation codes into the DevTools diagnostics host so
    // post-connect deprecations also surface in the DevTools UI.
    registerHostDiagnostics(ctx)

    function registerFn(name: string, handler: any) {
      try {
        host.register({ name, handler })
      }
      catch (e) {
        logger.warn(
          colors.yellow(`[nuxt-devtools] Failed to register RPC function "${name}":\n`)
          + colors.red((e as Error)?.message || ''),
        )
      }
    }

    // Register all collected server functions under the devframe-convention
    // namespace (`nuxt:devtools:<name>`).
    for (const [name, handler] of Object.entries(serverFunctions)) {
      if (typeof handler !== 'function')
        continue
      registerFn(`${RPC_NAMESPACE}:${name}`, handler)
      // TODO(@nuxt/devtools next major): drop these bare-name aliases, kept for
      // backward compatibility with callers using the un-namespaced names.
      registerFn(name, handler as any)
    }

    // Register extended (namespaced) functions
    for (const [namespace, fns] of extendedRpcMap) {
      for (const [fnName, handler] of Object.entries(fns)) {
        if (typeof handler === 'function')
          registerFn(`${namespace}:${fnName}`, handler)
      }
    }

    // Signal that the DevTools kit is connected and ready. This is the
    // recommended place for modules to do their DevTools integration.
    await nuxt.callHook('devtools:ready', kitCtx)
  }

  // NOTE: do not spread `ctx` here (`{ ...ctx }`) — `ctx.devtoolsKit` is a
  // getter backed by the `devtoolsKitCtx` closure variable above, and object
  // spread/`Object.assign` read a getter's *current* value into a plain
  // property on the new object. At this point (synchronous module setup,
  // before the Vite DevTools plugin has connected) that value is always
  // `undefined`, which would permanently freeze every consumer's `ctx.devtoolsKit`
  // to `undefined` even after the kit connects. Return the same live `ctx`
  // object (plus `connectDevToolsKit`) so the getter keeps working for callers
  // like `module-main.ts`'s integrations (e.g. the VS Code Server launcher).
  return {
    connectDevToolsKit,
    ctx,
  }
}
