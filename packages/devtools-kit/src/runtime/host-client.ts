import { shallowRef } from 'vue'
import type { NuxtDevtoolsHostClient } from '@nuxt/devtools-kit/types'
import type { Ref } from 'vue'

let clientRef: Ref<NuxtDevtoolsHostClient | undefined> | undefined
const fns = [] as ((client: NuxtDevtoolsHostClient) => void)[]

export function onDevtoolsHostClientConnected(fn: (client: NuxtDevtoolsHostClient) => void) {
  fns.push(fn)

  if (typeof window === 'undefined')
    return

  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-ignore injection
  if (window.__NUXT_DEVTOOLS_HOST__) {
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-ignore injection
    fns.forEach(fn => fn(window.__NUXT_DEVTOOLS_HOST__))
  }

  Object.defineProperty(window, '__NUXT_DEVTOOLS_HOST__', {
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

export function useDevtoolsHostClient() {
  if (!clientRef) {
    clientRef = shallowRef<NuxtDevtoolsHostClient | undefined>()

    onDevtoolsHostClientConnected(setup)
  }

  function setup(client: NuxtDevtoolsHostClient) {
    clientRef!.value = client
  }

  return clientRef
}
