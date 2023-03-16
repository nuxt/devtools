import type { Lang } from 'shiki-es'
import type { NuxtDevtoolsClient, NuxtDevtoolsHostClient, NuxtDevtoolsIframeClient, VueInspectorData } from '@nuxt/devtools-kit/types'
import { renderMarkdown } from './client-services/markdown'
import { renderCodeHighlight } from './client-services/shiki'
import { extendedRpcMap, rpc } from './rpc'

export function useClient() {
  return useState<NuxtDevtoolsHostClient>('devtools-client')
}

export function useClientRoute() {
  const client = useClient()
  return computed(() => client.value?.nuxt.vueApp.config.globalProperties?.$route)
}

export function useClientRouter() {
  const client = useClient()
  return computed(() => client.value?.nuxt.vueApp.config.globalProperties?.$router)
}

export function useComponentInspectorData() {
  return useState<VueInspectorData>('devtools-component-inspector-data')
}

const connectionTimeout = ref(false)
setTimeout(() => {
  connectionTimeout.value = true
}, 2000)

export const showConnectionWarning = computed(() => {
  return connectionTimeout.value && !useClient().value
})

export function useInjectionClient(): ComputedRef<NuxtDevtoolsIframeClient> {
  const client = useClient()
  const mode = useColorMode()

  return computed(() => ({
    host: client.value,
    devtools: <NuxtDevtoolsClient>{
      rpc,
      colorMode: mode.value,
      renderCodeHighlight(code, lang) {
        return renderCodeHighlight(code, lang as Lang)
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
