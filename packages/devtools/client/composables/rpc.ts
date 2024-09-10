import { createBirpc } from 'birpc'
import { parse, stringify } from 'flatted'
import { tryCreateHotContext } from 'vite-hot-client'
import { WS_EVENT_NAME } from '../../src/constant'
import type { ClientFunctions, ServerFunctions } from '../../src/types'

export const wsConnecting = ref(false)
export const wsError = ref<any>()
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
    const [namespace, fnName] = name.split(':')
    return extendedRpcMap.get(namespace)?.[fnName]
  },
  onError(error, name) {
    console.error(`[nuxt-devtools] RPC error on executing "${name}":`, error)
  },
  timeout: 120_000,
})

async function connectVite() {
  let base = window.parent?.__NUXT__?.config?.app?.baseURL ?? '/'
  const buildAssetsDir = window.parent?.__NUXT__?.config?.app.buildAssetsDir.replace(/^\/|\/$/g, '') ?? '_nuxt'
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
    throw new Error('Unable to connect to devtools')
  }

  hot.on(WS_EVENT_NAME, (data) => {
    wsConnecting.value = false
    onMessage(data)
  })

  wsConnecting.value = true

  hot.on('vite:ws:connect', () => {
    wsConnecting.value = false
  })
  hot.on('vite:ws:disconnect', () => {
    wsConnecting.value = true
  })

  return hot
}
