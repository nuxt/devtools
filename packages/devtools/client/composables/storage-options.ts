import type { ToRefs } from 'vue'
import type { NuxtDevToolsOptions } from '../../types'
import { watchDebounced } from '@vueuse/core'
import { reactive, toRefs } from 'vue'
import { defaultTabOptions } from '../../src/constant'
import { devAuthToken, isDevAuthed } from './dev-auth'
import { rpc } from './rpc'

const cache = new Map<string, any>()

function getTabOptions<T extends keyof NuxtDevToolsOptions>(tab: T): ToRefs<NuxtDevToolsOptions[T]> {
  if (cache.has(tab)) {
    return cache.get(tab)
  }
  const source = reactive({ ...defaultTabOptions[tab] }) as NuxtDevToolsOptions[T]
  const refs = toRefs(source)
  cache.set(tab, refs)

  rpc.getOptions(tab)
    .then((options) => {
      Object.assign(source, options)

      watchDebounced(
        source,
        async (options) => {
          // Persisting options writes to disk and is a token-gated action.
          // Only persist when the session is already authenticated, and never
          // trigger an auth prompt from this passive watcher.
          if (!isDevAuthed.value || !devAuthToken.value)
            return
          rpc.updateOptions(devAuthToken.value, tab, options)
        },
        { deep: true, flush: 'post', debounce: 500, maxWait: 1000 },
      )
    })

  return refs
}

export function useDevToolsOptions<T extends keyof NuxtDevToolsOptions>(tab: T): ToRefs<NuxtDevToolsOptions[T]> {
  return getTabOptions(tab)
}
