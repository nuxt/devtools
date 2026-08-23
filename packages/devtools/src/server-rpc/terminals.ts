import type { ViteDevToolsNodeContext } from '@vitejs/devtools-kit'
import type { NuxtDevtoolsServerContext, ServerFunctions, TerminalState } from '../types'
import { DEVTOOLS_TERMINALS_DOCK_ID } from '@vitejs/devtools-kit/constants'
import { createUniqueSessionId } from '../utils/session-id'

type TerminalsHost = ViteDevToolsNodeContext['terminals']
type DevframeTerminalSession = Parameters<TerminalsHost['register']>[0]

/**
 * Broadcast a terminal-exit signal to the DevTools client. This is the minimal
 * completion event for the generic package-update flow only (`runNpmCommand`),
 * whose run RPC returns before the process exits; the bridge below does **not**
 * use it. Safe to call before the kit connects (it no-ops).
 */
export function broadcastTerminalExit(ctx: NuxtDevtoolsServerContext, id: string, code?: number) {
  ctx.devtoolsKit?.rpc.broadcast({ method: 'onTerminalExit', args: [{ id, code }], event: true } as any)
}

/**
 * One run of a legacy terminal. A single legacy id (e.g. `my-module:build`) can
 * be re-registered many times via `startSubprocess().clear()`/`restart()`; each
 * re-registration mints a fresh {@link BridgedRun} with a new unique Devframe
 * session id and an incremented `generation`, so a delayed callback from a
 * previous run can be recognised as stale and dropped.
 */
interface BridgedRun {
  legacyId: string
  /** Unique Devframe session id for this run (readable prefix + counter). */
  sessionId: string
  /** Per-legacy-id run counter; bumped on every re-registration. */
  generation: number
  session: DevframeTerminalSession
  controller?: ReadableStreamDefaultController<string>
  /** True once the session is registered with the host (post-`devtools:ready`). */
  registered: boolean
  streamClosed: boolean
  /** Chunks that arrived before the host was ready, replayed in order on register. */
  pendingChunks: string[]
  /** An exit that arrived before the host was ready, applied right after register. */
  pendingExit?: { code?: number }
}

/**
 * Map an exit code to a Devframe terminal status: `stopped` for a clean exit
 * (code 0 or omitted, e.g. killed by signal), `error` only for a defined
 * non-zero code.
 */
function statusForExit(code?: number): DevframeTerminalSession['status'] {
  return code == null || code === 0 ? 'stopped' : 'error'
}

/**
 * Bridge the Nuxt `devtools:terminal:*` hooks onto the Vite DevTools terminals
 * host (`ctx.terminals`), so terminals registered through the legacy
 * `startSubprocess()`/hook API surface in the built-in **Terminals** dock
 * instead of a bespoke `@xterm` UI + RPC.
 *
 * This bridge is **output + final status only**. The legacy action callbacks
 * (`onActionRestart`/`onActionTerminate`) and the `restartable`/`terminatable`
 * flags are intentionally ignored: Devframe cannot attach them to an externally
 * registered session, so no UI action is shown for these read-only sessions.
 * Programmatic control still works because `startSubprocess()` owns its process
 * and emits fresh hook events; only the old Nuxt UI controls disappear.
 *
 * Terminals may be registered during module setup — before the kit connects.
 * The `devtools:ready` hook only fires post-connect, so early registrations,
 * output chunks, **and** exit status are buffered and replayed once ready. (A
 * short-lived process can exit before the kit connects; dropping that exit would
 * leave the session stuck as `running` forever.)
 */
export function setupTerminalsBridge(ctx: NuxtDevtoolsServerContext) {
  const { nuxt } = ctx
  /** The current run for each legacy id. */
  const runs = new Map<string, BridgedRun>()
  const generations = new Map<string, number>()
  let host: TerminalsHost | undefined

  function createRun(terminal: TerminalState): BridgedRun {
    const legacyId = terminal.id
    const generation = (generations.get(legacyId) ?? 0) + 1
    generations.set(legacyId, generation)

    let controller: ReadableStreamDefaultController<string> | undefined
    // `start` runs synchronously in the ReadableStream constructor, so the
    // controller is captured immediately.
    const stream = new ReadableStream<string>({
      start(c) {
        controller = c
      },
    })

    // Do not pre-fill `session.buffer`: the host's `register()` binds the stream
    // and populates the scrollback from it, so seeding a buffer *and* streaming
    // the same chunks would double every line. We replay pre-ready chunks
    // through the stream instead.
    const session: DevframeTerminalSession = {
      id: createUniqueSessionId(legacyId),
      title: terminal.name,
      description: terminal.description,
      icon: terminal.icon,
      status: 'running',
      interactive: false,
      stream,
    }

    return {
      legacyId,
      sessionId: session.id,
      generation,
      session,
      controller,
      registered: false,
      streamClosed: false,
      pendingChunks: [],
    }
  }

  /** True when `run` is still the live run for its legacy id. */
  function isCurrent(run: BridgedRun): boolean {
    return runs.get(run.legacyId) === run
  }

  function closeStream(run: BridgedRun) {
    if (run.streamClosed)
      return
    run.streamClosed = true
    try {
      run.controller?.close()
    }
    catch {}
  }

  function applyExit(run: BridgedRun, code?: number) {
    if (!isCurrent(run) || run.streamClosed)
      return
    closeStream(run)
    run.session.status = statusForExit(code)
    host?.update(run.session)
  }

  function registerWithHost(run: BridgedRun) {
    // Guard against a run that was superseded before the host became ready.
    if (!host || run.registered || !isCurrent(run))
      return
    host.register(run.session)
    run.registered = true
    // Replay pre-ready output in order, then a pre-ready exit if any.
    for (const chunk of run.pendingChunks) {
      try {
        run.controller?.enqueue(chunk)
      }
      catch {}
    }
    run.pendingChunks.length = 0
    if (run.pendingExit) {
      const { code } = run.pendingExit
      run.pendingExit = undefined
      applyExit(run, code)
    }
  }

  nuxt.hook('devtools:terminal:register', (terminal) => {
    const existing = runs.get(terminal.id)
    if (existing) {
      // Re-registration (`clear()`/`restart()`): supersede the prior run. Close
      // its stream and drop its session so a fresh, unique session represents
      // the new run — a foreign session cannot be reset in place.
      closeStream(existing)
      if (host && existing.registered)
        host.remove(existing.session)
    }

    const run = createRun(terminal)
    runs.set(terminal.id, run)
    if (host)
      registerWithHost(run)
    return terminal.id
  })

  nuxt.hook('devtools:terminal:write', ({ id, data }) => {
    const run = runs.get(id)
    if (!run || run.streamClosed)
      return false
    if (run.registered) {
      try {
        run.controller?.enqueue(data)
      }
      catch {}
    }
    else {
      run.pendingChunks.push(data)
    }
    return true
  })

  nuxt.hook('devtools:terminal:exit', ({ id, code }) => {
    const run = runs.get(id)
    if (!run)
      return false
    if (run.registered)
      applyExit(run, code)
    else
      run.pendingExit = { code }
    return true
  })

  nuxt.hook('devtools:terminal:remove', ({ id }) => {
    const run = runs.get(id)
    if (!run)
      return false
    closeStream(run)
    runs.delete(id)
    if (host && run.registered)
      host.remove(run.session)
    return true
  })

  nuxt.hook('devtools:ready', (kit) => {
    host = kit.terminals
    // Register every run buffered before the kit connected, replaying their
    // pre-ready output and exit status.
    for (const run of runs.values())
      registerWithHost(run)
  })

  return {
    /**
     * Focus the built-in **Terminals** dock on a session (Devframe 0.7
     * `docks.activate`, driven by the `hub:docks:activate` RPC). Replaces the
     * old in-client "go to Terminals tab" navigation now that terminals live in
     * the hub dock. `id` is a unique Devframe session id (from a bridged run or
     * a `startChildProcess` call). Returns `false` when the kit isn't connected
     * or the session is unknown.
     */
    async revealTerminal(id: string) {
      const kit = ctx.devtoolsKit
      if (!kit)
        return false
      if (!kit.terminals.sessions.has(id))
        return false
      kit.docks.activate(DEVTOOLS_TERMINALS_DOCK_ID, { sessionId: id })
      return true
    },
  } satisfies Partial<ServerFunctions>
}
