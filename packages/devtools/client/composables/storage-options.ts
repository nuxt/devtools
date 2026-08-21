import type { ToRefs } from 'vue'
import type { ServerFunctions } from '../../src/types'
import type { NuxtDevToolsOptions } from '../../types'
import { watchDebounced } from '@vueuse/core'
import { reactive, toRefs } from 'vue'
import { createDefaultTabOptions } from '../../src/constant'
import { RPC_NAMESPACE } from '../../src/rpc-namespace'
import { connectPromise, rpcClient } from './rpc'

const cache = new Map<string, any>()

function getTabOptions<T extends keyof NuxtDevToolsOptions>(tab: T): ToRefs<NuxtDevToolsOptions[T]> {
  if (cache.has(tab)) {
    return cache.get(tab)
  }
  const source = reactive(createDefaultTabOptions()[tab]) as NuxtDevToolsOptions[T]
  const refs = toRefs(source)
  cache.set(tab, refs)

  async function loadOptions() {
    const client = rpcClient.value || await connectPromise
    return client.call(`${RPC_NAMESPACE}:getOptions` as any, tab) as Promise<Awaited<ReturnType<ServerFunctions['getOptions']>>>
  }

  async function persistOptions(options: NuxtDevToolsOptions[T]) {
    const client = rpcClient.value || await connectPromise
    return client.call(`${RPC_NAMESPACE}:updateOptions` as any, tab, options) as Promise<Awaited<ReturnType<ServerFunctions['updateOptions']>>>
  }

  loadOptions()
    .then((options) => {
      Object.assign(source, options)

      watchDebounced(
        source,
        (options) => {
          // Best-effort persistence: a transient RPC failure here (e.g. the
          // connection was torn down and re-established after a dev-server
          // reload) shouldn't surface as an uncaught error — the next change
          // will simply retry the write.
          persistOptions(options).catch((error) => {
            console.error(`[nuxt-devtools] Failed to persist "${String(tab)}" options`, error)
          })
        },
        { deep: true, flush: 'post', debounce: 500, maxWait: 1000 },
      )
    })
    .catch((error) => {
      // Same as above: don't let a transient disconnect (e.g. right after a
      // Nuxt dev-server reload) throw an uncaught error — fall back to the
      // in-memory defaults already seeded above and keep the UI usable.
      console.error(`[nuxt-devtools] Failed to load "${String(tab)}" options`, error)
    })

  return refs
}

export function useDevToolsOptions<T extends keyof NuxtDevToolsOptions>(tab: T): ToRefs<NuxtDevToolsOptions[T]> {
  return getTabOptions(tab)
}
