import type { ServerFunctions, TerminalData } from '../types'
import type { RPCContext } from './types'

export function setupTerminalRPC({ nuxt, birpc }: RPCContext) {
  const terminals: TerminalData[] = []

  nuxt.hook('devtools:terminal:register', (terminal) => {
    const clone = {
      ...terminal,
    }
    clone.id ||= Math.random().toString() // TODO: use random id
    clone.buffer ||= ''
    clone.streams
      ?.forEach(s => s.on('data', (data) => {
        const delta = data.toString()
        clone.buffer += delta
        birpc.broadcast.onTerminalData.asEvent(clone.id, delta)
      }))
    terminals.push(clone)
  })

  return {
    listTerminals() {
      return terminals.map(i => ({
        id: i.id,
        name: i.name,
        description: i.description,
        icon: i.icon,
      }))
    },
    getTerminal(id: string) {
      const terminal = terminals.find(t => t.id === id)
      return terminal
    },
  } satisfies Partial<ServerFunctions>
}
