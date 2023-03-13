import type { ServerFunctions, TerminalInfo, TerminalState } from '../types'
import type { RPCContext } from './types'
import type {} from '../types/hooks'

export function setupTerminalRPC({ nuxt, birpc, refresh }: RPCContext) {
  const terminals = new Map<string, TerminalState>()

  nuxt.hook('devtools:terminal:register', (terminal) => {
    terminals.set(terminal.id, terminal)
    refresh('getTerminals')
    return terminal.id
  })

  nuxt.hook('devtools:terminal:remove', (id) => {
    if (!terminals.has(id))
      return false
    terminals.delete(id)
    refresh('getTerminals')
    return true
  })

  nuxt.hook('devtools:terminal:write', (id: string, data: string) => {
    const terminal = terminals.get(id)
    if (!terminal)
      return false

    terminal.buffer ||= ''
    terminal.buffer += data
    birpc.broadcast.onTerminalData.asEvent(id, data)
    return true
  })

  function serializeTerminal(terminal: TerminalState, buffer?: boolean): TerminalInfo
  function serializeTerminal(terminal: TerminalState | undefined, buffer?: boolean): TerminalInfo | undefined
  function serializeTerminal(terminal?: TerminalState, buffer = false): TerminalInfo | undefined {
    if (!terminal)
      return
    return {
      id: terminal.id,
      name: terminal.name,
      description: terminal.description,
      icon: terminal.icon,
      terminatable: !!terminal.onActionTerminate,
      restartable: !!terminal.onActionRestart,
      buffer: buffer
        ? terminal.buffer
        : undefined,
    }
  }

  return {
    getTerminals() {
      return Array.from(terminals.values())
        .map(i => serializeTerminal(i))
    },
    getTerminalDetail(id: string) {
      return serializeTerminal(terminals.get(id), true)
    },
  } satisfies Partial<ServerFunctions>
}
