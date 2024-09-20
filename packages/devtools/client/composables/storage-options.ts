import type { ToRefs } from 'vue'
import type { NuxtDevToolsOptions } from '../../types'
import { watchDebounced } from '@vueuse/core'
import { toRefs } from 'vue'
import { defaultTabOptions } from '../../src/constant'
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
          rpc.updateOptions(tab, options)
        },
        { deep: true, flush: 'post', debounce: 500, maxWait: 1000 },
      )
    })

  return refs
}

export function useDevToolsOptions<T extends keyof NuxtDevToolsOptions>(tab: T): ToRefs<NuxtDevToolsOptions[T]> {
  return getTabOptions(tab)
}
