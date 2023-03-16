import type { Ref } from 'vue'
import { shallowRef, triggerRef } from 'vue'
import type { NuxtDevtoolsIframeClient } from './_types/client-api'

let clientRef: Ref<NuxtDevtoolsIframeClient | undefined> | undefined
const hasSetup = false
const fns = [] as ((client: NuxtDevtoolsIframeClient) => void)[]

export function onDevtoolsClientConnected(fn: (client: NuxtDevtoolsIframeClient) => void) {
  fns.push(fn)

  if (hasSetup)
    return

  // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
  // @ts-ignore injection
  if (window.__NUXT_DEVTOOLS__) {
    // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
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

export function useDevtoolsClient() {
  if (!clientRef) {
    clientRef = shallowRef<NuxtDevtoolsIframeClient | undefined>()

    onDevtoolsClientConnected(setup)
  }

  function setup(client: NuxtDevtoolsIframeClient) {
    clientRef!.value = client
    if (client.host) {
      client.host.hooks.hook('host:update:reactivity', () => {
        triggerRef(clientRef!)
      })
    }
  }

  return clientRef
}
