import type { NuxtDevtoolsClient, NuxtDevtoolsHostClient, NuxtDevtoolsIframeClient } from '@nuxt/devtools-kit/types'
import type { Unhead } from '@unhead/schema'
import type { DevToolsRpcClient } from '@vitejs/devtools-kit/client'
import type { ComputedRef } from 'vue'
import type { useRoute, useRouter } from '#imports'
import { useColorMode } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useState } from '#imports'
import { renderMarkdown } from './client-services/markdown'
import { renderCodeHighlight } from './client-services/shiki'
import { connectPromise, rpc, rpcClient, upsertClientFunction } from './rpc'

let warnedExtendClientRpc = false
/**
 * @deprecated `extendClientRpc` is deprecated. Register client RPC functions on
 * the devframe client context instead, via `getDevToolsRpcClient()` /
 * `getDevToolsClientContext()` from `@vitejs/devtools-kit/client`.
 */
function warnExtendClientRpcDeprecated() {
  if (warnedExtendClientRpc)
    return
  warnedExtendClientRpc = true
  console.warn(
    '[nuxt-devtools] `extendClientRpc` is deprecated. Register client RPC functions on the '
    + 'devframe client context instead (`getDevToolsRpcClient()` from `@vitejs/devtools-kit/client`).',
  )
}

export function useClient() {
  return useState<NuxtDevtoolsHostClient>('devtools-client')
}

export function useClientRoute(): ComputedRef<ReturnType<typeof useRoute>> {
  const client = useClient()
  return computed(() => client.value?.nuxt.vueApp.config.globalProperties?.$route)
}

export function useClientRouter(): ComputedRef<ReturnType<typeof useRouter>> {
  const client = useClient()
  return computed(() => client.value?.nuxt.vueApp.config.globalProperties?.$router)
}

export function useClientHead() {
  const client = useClient()
  return computed(() => client.value?.nuxt.vueApp.config.globalProperties?.$head as Unhead)
}

const connectionTimeout = ref(false)
setTimeout(() => {
  connectionTimeout.value = true
}, 2000)

export const showConnectionWarning = computed(() => {
  return connectionTimeout.value && !useClient().value
})

export function getColorMode() {
  return useColorMode({
    storageKey: 'nuxt-devtools-color-mode',
  })
}

export function useInjectionClient(): ComputedRef<NuxtDevtoolsIframeClient> {
  const client = useClient()
  const mode = getColorMode()

  return computed(() => ({
    host: client.value,
    devtools: <NuxtDevtoolsClient>{
      rpc,
      colorMode: mode.value,
      renderCodeHighlight(code, lang) {
        return renderCodeHighlight(code, lang as any)
      },
      renderMarkdown(code) {
        return renderMarkdown(code)
      },
      extendClientRpc(namespace, functions) {
        warnExtendClientRpcDeprecated()
        const register = (client: DevToolsRpcClient) => {
          for (const [name, handler] of Object.entries(functions)) {
            if (typeof handler === 'function')
              // force-registers (override by default) via upsertClientFunction
              upsertClientFunction(client, `${namespace}:${name}`, handler as any)
          }
        }

        if (rpcClient.value)
          register(rpcClient.value)
        else
          void connectPromise.then(register, () => {})

        return new Proxy({}, {
          get(_, key) {
            if (typeof key !== 'string')
              return
            return async (...args: any[]) => {
              const client = rpcClient.value || await connectPromise
              return client.call(`${namespace}:${key}` as any, ...args as any)
            }
          },
        })
      },
    },
  }))
}
