import { createBirpc } from 'birpc'
// eslint-disable-next-line import/named
import { parse, stringify } from 'flatted'
import type { ClientFunctions, ServerFunctions } from '../../src/types'

// TODO: auto reconnect and error overlay
const RECONNECT_INTERVAL = 2000

export const wsConnecting = ref(true)
export const wsError = ref<any>()
let onMessage: Function = () => {}

let client = await connectWS()

export const clientFunctions: ClientFunctions = {
  refresh () {}
}

export const rpc = createBirpc<ServerFunctions>(clientFunctions, {
  post: d => client.send(d),
  on: (fn) => { onMessage = fn },
  serialize: stringify,
  deserialize: parse
})

async function connectWS () {
  const ws = new WebSocket(`ws://${location.host}/__nuxt_devtools__/entry`)
  ws.addEventListener('message', e => onMessage(String(e.data)))
  ws.addEventListener('error', (e) => {
    wsError.value = e
  })
  ws.addEventListener('close', () => {
    // eslint-disable-next-line no-console
    console.log('[nuxt-devtools] WebSocket closed, reconnecting...')
    setTimeout(async () => {
      client = await connectWS()
    }, RECONNECT_INTERVAL)
  })
  wsConnecting.value = true
  if (ws.readyState !== WebSocket.OPEN) { await new Promise(resolve => ws.addEventListener('open', resolve)) }
  // eslint-disable-next-line no-console
  console.log('[nuxt-devtools] WebSocket connected.')
  wsConnecting.value = false
  wsError.value = null
  return ws
}

export const config = await rpc.getConfig()
