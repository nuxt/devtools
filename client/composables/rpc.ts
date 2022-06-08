import { createBirpc } from 'birpc'
import { parse, stringify } from 'flatted'
import type { ServerFunctions } from '../../src/types'

const ws = new WebSocket(`ws://${location.host}/__nuxt_devtools__/ws`)
if (ws.readyState !== WebSocket.OPEN)
  await new Promise(resolve => ws.addEventListener('open', resolve))

export const rpc = createBirpc<ServerFunctions>({}, {
  post: d => ws.send(d),
  on: fn => ws.addEventListener('message', e => fn(String(e.data))),
  serialize: stringify,
  deserialize: parse,
})
