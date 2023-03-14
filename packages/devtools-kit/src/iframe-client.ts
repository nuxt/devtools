import type { Ref } from 'vue'
import { shallowRef, triggerRef } from 'vue'
import type { NuxtDevtoolsIframeClient } from './types/client-api'

let clientRef: Ref<NuxtDevtoolsIframeClient | undefined> | undefined

export function useDevtoolsClient() {
  if (!clientRef) {
    clientRef = shallowRef<NuxtDevtoolsIframeClient | undefined>()

    // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
    // @ts-ignore injection
    if (window.__NUXT_DEVTOOLS__) {
      // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
      // @ts-ignore injection
      setup(window.__NUXT_DEVTOOLS__)
    }

    Object.defineProperty(window, '__NUXT_DEVTOOLS__', {
      set(value) {
        if (value)
          setup(value)
      },
      get() {
        return clientRef!.value
      },
      configurable: true,
    })
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
