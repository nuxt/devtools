import type { ViteDevToolsNodeContext } from '@vitejs/devtools-kit'
import type { NuxtDevtoolsServerContext, ServerFunctions, TerminalState } from '../types'

type TerminalsHost = ViteDevToolsNodeContext['terminals']
type DevframeTerminalSession = Parameters<TerminalsHost['register']>[0]

/**
 * Stable devframe id of the built-in `@devframes/plugin-terminals` dock. The
 * hub's `docks.activate(id, { sessionId })` focuses this dock (and, via
 * `params.sessionId`, a specific session) — see `DOCKS_ACTIVE_STATE_KEY` in
 * the plugin. Kept as a literal so we need no build dependency on the plugin.
 */
const TERMINALS_DOCK_ID = 'devframes_plugin_terminals'

/**
 * A `DevframeTerminalsHost` grows a `remove(session)` at runtime that isn't in
 * the published type surface yet. Prefer it (it disposes the bound stream and
 * emits the update event); fall back to deleting from the sessions map.
 */
function removeSession(host: TerminalsHost, session: DevframeTerminalSession) {
  const maybeRemove = (host as { remove?: (s: DevframeTerminalSession) => void }).remove
  if (typeof maybeRemove === 'function')
    maybeRemove.call(host, session)
  else
    host.sessions.delete(session.id)
}

/**
 * Broadcast a terminal-exit signal to the DevTools client so it can clear any
 * transient subprocess UI state (installing-modules / analyze-build / npm
 * updates). Safe to call before the kit connects (it no-ops).
 */
export function broadcastTerminalExit(ctx: NuxtDevtoolsServerContext, id: string, code?: number) {
  ctx.devtoolsKit?.rpc.broadcast({ method: 'onTerminalExit', args: [{ id, code }], event: true } as any)
}

interface BridgedTerminal {
  session: DevframeTerminalSession
  controller?: ReadableStreamDefaultController<string>
  state: TerminalState
  exited: boolean
}

/**
 * Bridge the Nuxt `devtools:terminal:*` hooks onto the Vite DevTools terminals
 * host (`ctx.terminals`), so module-registered terminals surface in the
 * built-in **Terminals** dock instead of a bespoke `@xterm` UI + RPC.
 *
 * The current hook model is "the module owns the process and streams output";
 * we map that to a read-only session registered via `ctx.terminals.register`
 * with a `ReadableStream` we push each `write` into.
 *
 * The "devframe owns the process" model (interactive PTYs, output-only child
 * processes) is intentionally *not* re-wrapped here: modules should use Vite
 * DevTools' own terminals host directly via the exposed
 * `onDevtoolsReady((ctx) => ctx.terminals.startChildProcess(...) /
 * .startPtySession(...))`, rather than a Nuxt-specific shim.
 *
 * Terminals may be registered during module setup — before the kit connects.
 * The `devtools:ready` hook only fires post-connect, so early events are
 * buffered in `terminals` and replayed inside the ready callback.
 */
export function setupTerminalsBridge(ctx: NuxtDevtoolsServerContext) {
  const { nuxt } = ctx
  const terminals = new Map<string, BridgedTerminal>()
  let host: TerminalsHost | undefined

  function createBridged(state: TerminalState): BridgedTerminal {
    let controller: ReadableStreamDefaultController<string> | undefined
    // `start` runs synchronously in the ReadableStream constructor, so the
    // controller is captured immediately. Chunks enqueued before the kit
    // connects stay queued in the stream and drain once a reader attaches.
    const stream = new ReadableStream<string>({
      start(c) {
        controller = c
      },
    })
    const buffer = typeof state.buffer === 'string' && state.buffer ? [state.buffer] : []
    const session: DevframeTerminalSession = {
      id: state.id,
      title: state.name,
      description: state.description,
      icon: state.icon,
      status: state.isTerminated ? 'stopped' : 'running',
      interactive: false,
      buffer,
      stream,
    }
    return { session, controller, state, exited: !!state.isTerminated }
  }

  nuxt.hook('devtools:terminal:register', (terminal) => {
    const existing = terminals.get(terminal.id)
    if (existing) {
      // Re-registration (e.g. `startSubprocess().clear()`/`restart()`): reset
      // the session back to running and clear the display buffer in place.
      existing.state = terminal
      existing.exited = false
      existing.session.status = 'running'
      existing.session.buffer?.splice(0, existing.session.buffer.length)
      host?.update(existing.session)
      return terminal.id
    }

    const bridged = createBridged(terminal)
    terminals.set(terminal.id, bridged)
    host?.register(bridged.session)
    return terminal.id
  })

  nuxt.hook('devtools:terminal:write', ({ id, data }) => {
    const bridged = terminals.get(id)
    if (!bridged)
      return false
    bridged.state.buffer = (bridged.state.buffer || '') + data
    try {
      bridged.controller?.enqueue(data)
    }
    catch {}
    return true
  })

  nuxt.hook('devtools:terminal:exit', ({ id, code }) => {
    const bridged = terminals.get(id)
    if (!bridged)
      return false
    bridged.exited = true
    bridged.state.isTerminated = true
    bridged.session.status = code ? 'error' : 'stopped'
    try {
      bridged.controller?.close()
    }
    catch {}
    host?.update(bridged.session)
    broadcastTerminalExit(ctx, id, code)
    return true
  })

  nuxt.hook('devtools:terminal:remove', ({ id }) => {
    const bridged = terminals.get(id)
    if (!bridged)
      return false
    try {
      bridged.controller?.close()
    }
    catch {}
    terminals.delete(id)
    if (host)
      removeSession(host, bridged.session)
    return true
  })

  nuxt.hook('devtools:ready', (kit) => {
    host = kit.terminals
    // Replay terminals registered before the kit connected.
    for (const bridged of terminals.values()) {
      if (!host.sessions.has(bridged.session.id))
        host.register(bridged.session)
      if (bridged.exited)
        host.update(bridged.session)
    }
  })

  return {
    /**
     * Focus the built-in **Terminals** dock on a session (devframe 0.7
     * `docks.activate`). Replaces the old in-client "go to Terminals tab"
     * navigation now that terminals live in the hub dock. Returns `false`
     * when the kit isn't connected or the session is unknown.
     */
    async revealTerminal(id: string) {
      const kit = ctx.devtoolsKit
      if (!kit)
        return false
      if (!terminals.has(id) && !kit.terminals.sessions.has(id))
        return false
      kit.docks.activate(TERMINALS_DOCK_ID, { sessionId: id })
      return true
    },
  } satisfies Partial<ServerFunctions>
}
