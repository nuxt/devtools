import type { DevToolsRpcClient } from '@vitejs/devtools-kit/client'
import type { Ref } from 'vue'
import type { NuxtDevtoolsIframeClient } from '../types'
import { shallowRef, triggerRef } from 'vue'

let clientRef: Ref<NuxtDevtoolsIframeClient | undefined> | undefined
const hasSetup = false
const fns = [] as ((client: NuxtDevtoolsIframeClient) => void)[]

export function onDevtoolsClientConnected(fn: (client: NuxtDevtoolsIframeClient) => void) {
  fns.push(fn)

  if (hasSetup)
    return

  if (typeof window === 'undefined')
    return

  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-ignore injection
  if (window.__NUXT_DEVTOOLS__) {
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-ignore injection
    fns.forEach(fn => fn(window.__NUXT_DEVTOOLS__))
  }

  Object.defineProperty(window, '__NUXT_DEVTOOLS__', {
    set(value) {
      if (value)
        fns.forEach(fn => fn(value))
    },
    get() {
      return clientRef!.value
    },
    configurable: true,
  })

  return () => {
    fns.splice(fns.indexOf(fn), 1)
  }
}

/**
 * Run a callback once the Vite DevTools client is ready, receiving the connected
 * `DevToolsRpcClient` — the client-side mirror of the server's
 * `onDevtoolsReady((ctx) => …)`.
 *
 * This is the recommended way to do client-side DevTools integration (register
 * client RPC functions, call server functions, shared state, streaming, …):
 *
 * ```ts
 * import { onDevtoolsReady } from '@nuxt/devtools-kit/iframe-client'
 *
 * onDevtoolsReady((kit) => {
 *   kit.client.register({ name: 'my-module:on-update', type: 'event', handler })
 * })
 * ```
 */
export function onDevtoolsReady(fn: (kit: DevToolsRpcClient) => void) {
  return onDevtoolsClientConnected((client) => {
    const kit = client.devtools.devtoolsKit
    if (kit)
      fn(kit)
  })
}

export function useDevtoolsClient() {
  if (!clientRef) {
    clientRef = shallowRef<NuxtDevtoolsIframeClient | undefined>()

    onDevtoolsClientConnected(setup)
  }

  function onUpdateReactivity() {
    if (clientRef) {
      triggerRef(clientRef)
    }
  }

  function setup(client: NuxtDevtoolsIframeClient) {
    clientRef!.value = client
    if (client.host)
      client.host.hooks.hook('host:update:reactivity', onUpdateReactivity)
  }

  return clientRef
}
