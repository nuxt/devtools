import type { ClientFunctions, ServerFunctions } from '../../src/types'
import { useDebounce } from '@vueuse/core'
import { createBirpc } from 'birpc'
import { parse, stringify } from 'structured-clone-es'
import { tryCreateHotContext } from 'vite-hot-client'
import { ref, shallowRef } from 'vue'
import { WS_EVENT_NAME } from '../../src/constant'

export const wsConnecting = ref(false)
export const wsError = shallowRef<any>()
export const wsConnectingDebounced = useDebounce(wsConnecting, 2000)

const connectPromise = connectVite()
let onMessage: any = () => {}

export const clientFunctions = {
  // will be added in app.vue
} as ClientFunctions

export const extendedRpcMap = new Map<string, any>()

export const rpc = createBirpc<ServerFunctions, ClientFunctions>(clientFunctions, {
  post: async (d) => {
    (await connectPromise).send(WS_EVENT_NAME, d)
  },
  on: (fn) => {
    onMessage = fn
  },
  serialize: stringify,
  deserialize: parse,
  resolver(name, fn) {
    if (fn)
      return fn
    if (!name.includes(':'))
      return
    const [namespace, fnName] = name.split(':') as [string, string]
    return extendedRpcMap.get(namespace)?.[fnName]
  },
  onError(error, name) {
    console.error(`[nuxt-devtools] RPC error on executing "${name}":`, error)
  },
  timeout: 120_000,
})

async function connectVite() {
  const appConfig = window.parent?.__NUXT__?.config?.app
    ?? window.parent?.useNuxtApp?.()?.payload?.config?.app // Nuxt 4 removes __NUXT__

  let base = appConfig?.baseURL ?? '/'
  const buildAssetsDir = appConfig?.buildAssetsDir?.replace(/^\/|\/$/g, '') ?? '_nuxt'
  if (base && !base.endsWith('/'))
    base += '/'
  const current = window.location.href.replace(/\/__nuxt_devtools__\/client\/.*$/, '/')
  const hot = await tryCreateHotContext(undefined, Array.from(new Set([
    `${base}${buildAssetsDir}/`,
    `${base}_nuxt/`,
    base,
    `${current}${buildAssetsDir}/`,
    `${current}_nuxt/`,
    current,
  ])))

  if (!hot) {
    wsConnecting.value = true
    console.error('[nuxt-devtools] Unable to find Vite HMR context')
    throw new Error('Unable to connect to devtools')
  }

  hot.on(WS_EVENT_NAME, (data) => {
    wsConnecting.value = false
    onMessage(data)
  })

  wsConnecting.value = true

  hot.on('vite:ws:connect', () => {
    // eslint-disable-next-line no-console
    console.log('[nuxt-devtools] Connected to WebSocket')
    wsConnecting.value = false
  })
  hot.on('vite:ws:disconnect', () => {
    // eslint-disable-next-line no-console
    console.log('[nuxt-devtools] Disconnected from WebSocket')
    wsConnecting.value = true
  })

  return hot
}
