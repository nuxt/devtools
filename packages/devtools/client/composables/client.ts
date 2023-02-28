import type { Lang } from 'shiki-es'
import { renderMarkdown } from './client-services/markdown'
import { renderCodeHighlight } from './client-services/shiki'
import type { NuxtDevtoolsHostClient, NuxtDevtoolsIframeClient, VueInspectorData } from '~/../src/types'

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

export function getInjectionClient(): NuxtDevtoolsIframeClient {
  const client = useClient()
  return {
    host: client.value,
    devtools: {
      rpc,
      renderCodeHighlight(code, lang) {
        return renderCodeHighlight(code, lang as Lang)
      },
      renderMarkdown(code) {
        return renderMarkdown(code)
      },
    },
  }
}
