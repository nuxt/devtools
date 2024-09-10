import { shallowRef } from 'vue'
import type { NuxtDevtoolsHostClient } from '@nuxt/devtools/types'
import type { Ref } from 'vue'

/**
 * Get Nuxt DevTools client for host app
 *
 * Returns undefined if not in development mode or the devtools is not enabled
 */
export function useNuxtDevTools(): Ref<NuxtDevtoolsHostClient | undefined> {
  const r = shallowRef()
  if (!process.dev)
    return r

  if (import.meta.server)
    return r

  if (window.__NUXT_DEVTOOLS_HOST__) {
    r.value = window.__NUXT_DEVTOOLS_HOST__
  }
  else {
    Object.defineProperty(window, '__NUXT_DEVTOOLS_HOST__', {
      set(value) {
        r.value = value
      },
      get() {
        return r.value
      },
      enumerable: false,
      configurable: true,
    })
  }
  return r
}
