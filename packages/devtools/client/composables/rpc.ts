import type { DevToolsRpcClient } from '@vitejs/devtools-kit/client'
import type { AsyncServerFunctions, ClientFunctions } from '../../src/types'
import { getDevToolsRpcClient } from '@vitejs/devtools-kit/client'
import { useDebounce } from '@vueuse/core'
import { ref, shallowRef } from 'vue'
import { RPC_NAMESPACE } from '../../src/rpc-namespace'

export const WS_DEBOUNCE_TIME = 2000
export const wsConnectedOnce = ref(false)
export const wsConnecting = ref(true)
export const wsError = shallowRef<any>()
export const wsConnectingDebounced = useDebounce(wsConnecting, WS_DEBOUNCE_TIME)

export const clientFunctions = {
  // will be added in setup/client-rpc.ts
} as ClientFunctions

export const rpcClient = shallowRef<DevToolsRpcClient>()

export const connectPromise = connectDevToolsRpc()

/**
 * Proxy-based RPC object that provides backward-compatible `rpc.functionName()` interface.
 * Server functions are called via Vite DevTools Kit's RPC client.
 */
export const rpc = new Proxy({} as AsyncServerFunctions, {
  get: (_, method: string) => {
    return async (...args: any[]) => {
      const client = rpcClient.value || await connectPromise
      // Nuxt DevTools' server functions are registered under the devframe
      // `nuxt:devtools:` namespace.
      return client.call(`${RPC_NAMESPACE}:${method}` as any, ...args as any)
    }
  },
})

async function connectDevToolsRpc(): Promise<DevToolsRpcClient> {
  try {
    const client = await getDevToolsRpcClient()

    rpcClient.value = client

    // Register client functions so the server can call them.
    for (const [name, handler] of Object.entries(clientFunctions)) {
      if (typeof handler === 'function')
        upsertClientFunction(client, name, handler)
    }

    // eslint-disable-next-line no-console
    console.log('[nuxt-devtools] Connected to Vite DevTools RPC')
    wsConnecting.value = false
    wsConnectedOnce.value = true

    return client
  }
  catch (e) {
    wsConnecting.value = true
    wsError.value = e
    console.error('[Nuxt DevTools] Unable to connect to Vite DevTools RPC', e)
    throw e
  }
}

/**
 * Register additional client functions after initial connection.
 * Used by setup/client-rpc.ts to register functions that are set up later.
 */
export async function registerClientFunctions() {
  const client = rpcClient.value || await connectPromise
  for (const [name, handler] of Object.entries(clientFunctions)) {
    if (typeof handler === 'function')
      upsertClientFunction(client, name, handler)
  }
}

/**
 * Register (or replace) a client-side event function on the devframe RPC host.
 *
 * devframe 0.6 split registration into `register()` (throws DF0021 if the name
 * already exists) and `update()` (throws DF0022 if it does not). We always
 * force-register so this stays an idempotent override regardless of the current
 * state — the client re-runs registration on (re)connect and integrations may
 * override a function, so neither error should ever surface.
 */
export function upsertClientFunction(client: DevToolsRpcClient, name: string, handler: (...args: any[]) => any) {
  const definition = { name, type: 'event', handler } as const
  ;(client.client.register as (fn: any, force?: boolean) => void)(definition, true)
}
