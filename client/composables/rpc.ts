import { createBirpc } from 'birpc'
import { parse, stringify } from 'flatted'
import type { ClientFunctions, ServerFunctions } from '../../src/types'

// TODO: auto reconnect and error overlay
const RECONNECT_INTERVAL = 2000

export const wsConnecting = ref(true)
export const wsError = ref<any>()

const wsClient = ref<WebSocket>(await connectWS())

let onMessage: Function = () => {}

export const clientFunctions: ClientFunctions = {
  refresh() {}, // will be replaced in app.vue
}

export const rpc = createBirpc<ServerFunctions>(clientFunctions, {
  post: d => wsClient.value.send(d),
  on: (fn) => { onMessage = fn },
  serialize: stringify,
  deserialize: parse,
})

async function connectWS() {
  const ws = new WebSocket(`ws://${location.host}/__nuxt_devtools__/entry`)
  ws.addEventListener('message', e => onMessage(String(e.data)))
  ws.addEventListener('error', (e) => {
    wsError.value = e
  })
  ws.addEventListener('close', () => {
    // eslint-disable-next-line no-console
    console.log('[nuxt-devtools] WebSocket closed, reconnecting...')
    wsConnecting.value = true
    setTimeout(async () => {
      wsClient.value = await connectWS()
    }, RECONNECT_INTERVAL)
  })
  wsConnecting.value = true
  if (ws.readyState !== WebSocket.OPEN)
    await new Promise(resolve => ws.addEventListener('open', resolve))

  // eslint-disable-next-line no-console
  console.log('[nuxt-devtools] WebSocket connected.')
  wsConnecting.value = false
  wsError.value = null

  return ws
}
