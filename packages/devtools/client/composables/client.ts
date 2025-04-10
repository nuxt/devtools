import type { useRoute, useRouter } from '#imports'
import type { NuxtDevtoolsClient, NuxtDevtoolsHostClient, NuxtDevtoolsIframeClient } from '@nuxt/devtools-kit/types'
import type { Unhead } from '@unhead/schema'
import type { ComputedRef } from 'vue'
import { useState } from '#imports'
import { useColorMode } from '@vueuse/core'
import { computed, ref } from 'vue'
import { renderMarkdown } from './client-services/markdown'
import { renderCodeHighlight } from './client-services/shiki'
import { extendedRpcMap, rpc } from './rpc'

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
        extendedRpcMap.set(namespace, functions)

        return new Proxy({}, {
          get(_, key) {
            if (typeof key !== 'string')
              return
            return (rpc as any)[`${namespace}:${key}`]
          },
        })
      },
    },
  }))
}
