import type { NuxtDevtoolsClient, NuxtDevtoolsHostClient, NuxtDevtoolsIframeClient } from '@nuxt/devtools-kit/types'
import type { Unhead } from '@unhead/schema'
import type { DevToolsRpcClient } from '@vitejs/devtools-kit/client'
import type { ComputedRef } from 'vue'
import type { useRoute, useRouter } from '#imports'
import { usePreferredDark } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useState } from '#imports'
import { renderMarkdown } from './client-services/markdown'
import { renderCodeHighlight } from './client-services/shiki'
import { notify } from './notify'
import { connectPromise, rpc, rpcClient, upsertClientFunction } from './rpc'

let warnedExtendClientRpc = false
/**
 * @deprecated `extendClientRpc` is deprecated. Use `onDevtoolsReady` from
 * `@nuxt/devtools-kit/iframe-client`, or the exposed `devtoolsKit` client.
 */
function warnExtendClientRpcDeprecated() {
  if (warnedExtendClientRpc)
    return
  warnedExtendClientRpc = true
  console.warn(
    '[nuxt-devtools] `extendClientRpc` is deprecated. Use `onDevtoolsReady((kit) => '
    + 'kit.client.register(...))` from `@nuxt/devtools-kit/iframe-client`.',
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

export type ColorScheme = 'dark' | 'light'

/**
 * Color scheme pushed down by whatever embeds this client — the host app's
 * resolved scheme (`useClientColorMode`), or a custom-tab iframe carrying its
 * own toggle.
 *
 * Deliberately *not* persisted. This mirrors someone else's state, so storing
 * it overwrote our own "follow the OS" default, permanently: nothing ever wrote
 * `auto` back. Every surface without an embedder (the standalone hub UI, the
 * client opened directly, `nuxi dev client`) was then frozen on whatever the OS
 * happened to be the last time an embedder was attached.
 */
const embedderColorMode = ref<ColorScheme>()

export function setEmbedderColorMode(mode: ColorScheme | undefined) {
  embedderColorMode.value = mode
}

let colorMode: ComputedRef<ColorScheme> | undefined

/**
 * The scheme the DevTools UI renders in: the embedder's when there is one,
 * otherwise the live OS `prefers-color-scheme`.
 */
export function getColorMode(): ComputedRef<ColorScheme> {
  if (!colorMode) {
    const preferredDark = usePreferredDark()
    colorMode = computed(() => embedderColorMode.value ?? (preferredDark.value ? 'dark' : 'light'))
  }
  return colorMode
}

export function useInjectionClient(): ComputedRef<NuxtDevtoolsIframeClient> {
  const client = useClient()
  const mode = getColorMode()

  return computed(() => ({
    host: client.value,
    devtools: <NuxtDevtoolsClient>{
      rpc,
      notify,
      devtoolsKit: rpcClient.value,
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
