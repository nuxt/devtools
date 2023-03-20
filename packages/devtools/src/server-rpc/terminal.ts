import type { NuxtDevtoolsServerContext, ServerFunctions, TerminalAction, TerminalInfo, TerminalState } from '../types'

export function setupTerminalRPC({ nuxt, rpc, refresh }: NuxtDevtoolsServerContext) {
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
    rpc.broadcast.onTerminalData.asEvent(id, data)
    return true
  })

  nuxt.hook('devtools:terminal:exit', (id: string, code = 0) => {
    const terminal = terminals.get(id)
    if (!terminal)
      return false

    terminal.isTerminated = true
    rpc.broadcast.onTerminalExit.asEvent(id, code)
    refresh('getTerminals')
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
      terminatable: terminal.terminatable ?? !!terminal.onActionTerminate,
      restartable: terminal.restartable ?? !!terminal.onActionRestart,
      isTerminated: terminal.isTerminated,
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
    async runTerminalAction(id: string, action: TerminalAction) {
      const terminal = terminals.get(id)
      if (!terminal)
        return false

      switch (action) {
        case 'restart':
          if (!terminal.onActionRestart)
            return false
          await terminal.onActionRestart()
          return true
        case 'terminate':
          if (!terminal.onActionTerminate)
            return false
          await terminal.onActionTerminate()
          return true
        case 'remove':
          if (!terminal.isTerminated)
            terminal.onActionTerminate?.()
          terminals.delete(id)
          refresh('getTerminals')
          return true
        case 'clear':
          terminal.buffer = ''
          refresh('getTerminals')
          return true
      }
    },
  } satisfies Partial<ServerFunctions>
}
