import type { DevToolsRpcClient } from '@vitejs/devtools-kit/client'
import type { AsyncServerFunctions, ClientFunctions } from '../../src/types'
import { getDevToolsRpcClient } from '@vitejs/devtools-kit/client'
import { useDebounce } from '@vueuse/core'
import { ref, shallowRef } from 'vue'

export const WS_DEBOUNCE_TIME = 2000
export const wsConnectedOnce = ref(false)
export const wsConnecting = ref(true)
export const wsError = shallowRef<any>()
export const wsConnectingDebounced = useDebounce(wsConnecting, WS_DEBOUNCE_TIME)

export const clientFunctions = {
  // will be added in setup/client-rpc.ts
} as ClientFunctions

export const extendedRpcMap = new Map<string, any>()

let rpcClient: DevToolsRpcClient | undefined

const connectPromise = connectDevToolsRpc()

/**
 * Proxy-based RPC object that provides backward-compatible `rpc.functionName()` interface.
 * Server functions are called via Vite DevTools Kit's RPC client.
 */
export const rpc = new Proxy({} as AsyncServerFunctions, {
  get: (_, method: string) => {
    return async (...args: any[]) => {
      const client = rpcClient || await connectPromise
      // Check extended RPC map first for namespaced functions
      if (method.includes(':')) {
        const [namespace, fnName] = method.split(':') as [string, string]
        const extFn = extendedRpcMap.get(namespace)?.[fnName]
        if (extFn)
          return extFn(...args)
      }
      return client.call(method as any, ...args as any)
    }
  },
})

async function connectDevToolsRpc(): Promise<DevToolsRpcClient> {
  try {
    const client = await getDevToolsRpcClient()

    rpcClient = client

    // Register client functions so the server can call them
    for (const [name, handler] of Object.entries(clientFunctions)) {
      if (typeof handler === 'function') {
        client.client.register({
          name,
          type: 'event',
          handler: handler as any,
        })
      }
    }

    // Register extended client RPC functions
    for (const [namespace, fns] of extendedRpcMap) {
      for (const [fnName, handler] of Object.entries(fns)) {
        if (typeof handler === 'function') {
          client.client.register({
            name: `${namespace}:${fnName}`,
            type: 'event',
            handler: handler as any,
          })
        }
      }
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
  const client = rpcClient || await connectPromise
  for (const [name, handler] of Object.entries(clientFunctions)) {
    if (typeof handler === 'function') {
      try {
        client.client.update({
          name,
          type: 'event',
          handler: handler as any,
        })
      }
      catch {
        client.client.register({
          name,
          type: 'event',
          handler: handler as any,
        })
      }
    }
  }
}
