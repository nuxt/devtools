import { createHooks } from 'hookable'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setupTerminalsBridge } from '../src/server-rpc/terminals'

/** Yield to the microtask/timer queue so stream readers can drain. */
function flush() {
  return new Promise(resolve => setTimeout(resolve, 0))
}

interface FakeSession {
  id: string
  status: string
  stream?: ReadableStream<string>
  [k: string]: unknown
}

/**
 * Minimal stand-in for the Devframe terminals host: it throws on duplicate ids
 * (`DF8200`) like the real one, and drains each registered session's stream into
 * a per-id chunk log so tests can assert output ordering + de-duplication.
 */
function createFakeHost() {
  const sessions = new Map<string, FakeSession>()
  const output = new Map<string, string[]>()
  const removed: string[] = []

  function drain(session: FakeSession) {
    if (!session.stream)
      return
    const chunks: string[] = []
    output.set(session.id, chunks)
    const reader = session.stream.getReader()
    void (async () => {
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done)
            break
          chunks.push(value)
        }
      }
      catch {}
    })()
  }

  return {
    sessions,
    output,
    removed,
    register(session: FakeSession) {
      if (sessions.has(session.id))
        throw new Error(`DF8200 duplicate ${session.id}`)
      sessions.set(session.id, session)
      drain(session)
      return session
    },
    update(session: FakeSession) {
      sessions.set(session.id, session)
    },
    remove(session: FakeSession) {
      removed.push(session.id)
      sessions.delete(session.id)
    },
  }
}

function createHarness() {
  const nuxt = createHooks()
  const host = createFakeHost()
  const ctx = { nuxt, devtoolsKit: undefined } as any
  const bridge = setupTerminalsBridge(ctx)

  return {
    nuxt,
    host,
    ctx,
    bridge,
    ready: () => nuxt.callHook('devtools:ready' as any, { terminals: host } as any),
    register: (t: any) => nuxt.callHook('devtools:terminal:register' as any, t),
    write: (id: string, data: string) => nuxt.callHook('devtools:terminal:write' as any, { id, data }),
    exit: (id: string, code?: number) => nuxt.callHook('devtools:terminal:exit' as any, { id, code }),
    remove: (id: string) => nuxt.callHook('devtools:terminal:remove' as any, { id }),
    /** The unique Devframe session id minted for a legacy id (nth registration). */
    sessionIds: () => [...host.sessions.keys()],
  }
}

const term = (id: string) => ({ id, name: id, icon: 'i-carbon-terminal' })

describe('terminals bridge', () => {
  beforeEach(() => {
    vi.useRealTimers()
  })

  it('bridges live output and final status once ready', async () => {
    const h = createHarness()
    await h.ready()
    await h.register(term('mod:build'))

    // A fresh, unique Devframe id (not the legacy id).
    expect(h.sessionIds()).toHaveLength(1)
    const sessionId = h.sessionIds()[0]!
    expect(sessionId).toMatch(/^mod:build#/)
    expect(h.host.sessions.get(sessionId)!.status).toBe('running')

    await h.write('mod:build', 'hello ')
    await h.write('mod:build', 'world')
    await flush()
    expect(h.host.output.get(sessionId)).toEqual(['hello ', 'world'])

    await h.exit('mod:build', 0)
    expect(h.host.sessions.get(sessionId)!.status).toBe('stopped')
  })

  it('buffers registration + output that arrive before ready, without duplicating', async () => {
    const h = createHarness()
    await h.register(term('mod:build'))
    await h.write('mod:build', 'a')
    await h.write('mod:build', 'b')
    // Nothing registered with the host yet.
    expect(h.sessionIds()).toHaveLength(0)

    await h.ready()
    await flush()
    const sessionId = h.sessionIds()[0]!
    expect(h.host.output.get(sessionId)).toEqual(['a', 'b'])
  })

  it('applies an exit that arrived before ready (never stuck running)', async () => {
    const h = createHarness()
    await h.register(term('mod:build'))
    await h.write('mod:build', 'partial')
    await h.exit('mod:build', 1)

    await h.ready()
    await flush()
    const sessionId = h.sessionIds()[0]!
    expect(h.host.output.get(sessionId)).toEqual(['partial'])
    expect(h.host.sessions.get(sessionId)!.status).toBe('error')
  })

  it('maps exit codes to status: 0/undefined -> stopped, non-zero -> error', async () => {
    const h = createHarness()
    await h.ready()

    await h.register(term('a'))
    await h.exit('a', 0)
    await h.register(term('b'))
    await h.exit('b', undefined)
    await h.register(term('c'))
    await h.exit('c', 137)

    const byPrefix = (p: string) => h.host.sessions.get([...h.host.sessions.keys()].find(k => k.startsWith(p))!)!
    expect(byPrefix('a#').status).toBe('stopped')
    expect(byPrefix('b#').status).toBe('stopped')
    expect(byPrefix('c#').status).toBe('error')
  })

  it('re-registration mints a new session and drops the previous one', async () => {
    const h = createHarness()
    await h.ready()
    await h.register(term('mod:build'))
    const first = h.sessionIds()[0]!

    await h.register(term('mod:build'))
    const ids = h.sessionIds()
    expect(ids).toHaveLength(1)
    const second = ids[0]!
    expect(second).not.toBe(first)
    expect(h.host.removed).toContain(first)
  })

  it('drops a run superseded before the host is ready (stale generation)', async () => {
    const h = createHarness()
    await h.register(term('mod:build')) // run1 (buffered)
    await h.register(term('mod:build')) // run2 supersedes run1 before ready
    await h.write('mod:build', 'from-run2')

    await h.ready()
    await flush()
    // Only the current run registers; the stale run never reaches the host.
    expect(h.sessionIds()).toHaveLength(1)
    const sessionId = h.sessionIds()[0]!
    expect(h.host.output.get(sessionId)).toEqual(['from-run2'])
  })

  it('drops output after exit and removes the session on remove', async () => {
    const h = createHarness()
    await h.ready()
    await h.register(term('mod:build'))
    const sessionId = h.sessionIds()[0]!

    await h.exit('mod:build', 0)
    await h.write('mod:build', 'too-late')
    await flush()
    expect(h.host.output.get(sessionId)).toEqual([])

    await h.remove('mod:build')
    expect(h.host.removed).toContain(sessionId)
    expect(h.host.sessions.has(sessionId)).toBe(false)

    // A write for a forgotten legacy id is a no-op (no session resurrected).
    await h.write('mod:build', 'nope')
    await flush()
    expect(h.host.sessions.size).toBe(0)
  })
})
