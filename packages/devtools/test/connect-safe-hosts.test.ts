import { describe, expect, it, vi } from 'vitest'
import { createConnectSafeHosts, createConnectSafeRpc, flushPendingHostCalls } from '../src/server-rpc/connect-safe-hosts'

function rpcOptions(over: Partial<Parameters<typeof createConnectSafeRpc>[2]> = {}) {
  return {
    legacyBroadcast: {},
    legacyFunctions: {},
    onLegacyBroadcast: vi.fn(),
    onLegacyFunctions: vi.fn(),
    ...over,
  }
}

describe('connect-safe hosts', () => {
  it('returns empty reads before connect', () => {
    const hosts = createConnectSafeHosts(() => undefined, [])
    expect(hosts.terminals.sessions).toBeInstanceOf(Map)
    expect(hosts.terminals.sessions.size).toBe(0)
    expect(hosts.commands.list()).toEqual([])
    expect(hosts.docks.values()).toEqual([])
    // events stub never throws
    expect(() => hosts.messages.events.on('message:added', () => {})).not.toThrow()
  })

  it('buffers async mutators and resolves them after connect', async () => {
    let kit: any
    const queue: (() => void)[] = []
    const hosts = createConnectSafeHosts(() => kit, queue)

    const infoPromise = hosts.messages.info('hi')
    expect(queue).toHaveLength(1)

    const info = vi.fn(async () => ({ id: 'msg-1' }))
    kit = { messages: { info } }
    flushPendingHostCalls(queue)

    await expect(infoPromise).resolves.toEqual({ id: 'msg-1' })
    expect(info).toHaveBeenCalledWith('hi')
    expect(queue).toHaveLength(0)
  })

  it('returns a lazy handle whose calls replay onto the real handle', () => {
    let kit: any
    const queue: (() => void)[] = []
    const hosts = createConnectSafeHosts(() => kit, queue)

    const handle = hosts.docks.register({ id: 'x', title: 'X', type: 'iframe', url: '/' } as any)
    // Called before the real handle exists — should be recorded.
    ;(handle as any).update({ title: 'Y' })

    const realUpdate = vi.fn()
    const realRegister = vi.fn(() => ({ update: realUpdate }))
    kit = { docks: { register: realRegister } }
    flushPendingHostCalls(queue)

    expect(realRegister).toHaveBeenCalledOnce()
    expect(realUpdate).toHaveBeenCalledWith({ title: 'Y' })
  })

  it('forwards directly once connected', () => {
    const info = vi.fn(async () => ({ id: 'x' }))
    const hosts = createConnectSafeHosts(() => ({ messages: { info } } as any), [])
    hosts.messages.info('hey')
    expect(info).toHaveBeenCalledWith('hey')
  })

  it('diagnostics: buffers register and defines a standalone catalog before connect', () => {
    let kit: any
    const queue: (() => void)[] = []
    const hosts = createConnectSafeHosts(() => kit, queue)

    const defs = { codes: { MYP0001: { why: 'nope' } } }
    // defineDiagnostics returns a usable standalone catalog immediately.
    const catalog = hosts.diagnostics.defineDiagnostics(defs as any)
    expect(catalog).toBeTypeOf('object')
    expect(queue.length).toBeGreaterThanOrEqual(1)

    const register = vi.fn()
    const defineDiagnostics = vi.fn(() => ({ MYP0001: vi.fn() }))
    kit = { diagnostics: { logger: {}, register, defineDiagnostics } }
    flushPendingHostCalls(queue)

    // On connect the codes are registered into the real host too.
    expect(defineDiagnostics).toHaveBeenCalled()
    expect(register).toHaveBeenCalled()
  })
})

describe('connect-safe rpc', () => {
  it('forwards a native broadcast, buffering pre-connect', async () => {
    let kit: any
    const queue: (() => void)[] = []
    const opts = rpcOptions()
    const rpc = createConnectSafeRpc(() => kit?.rpc, queue, opts)

    const promise = rpc.broadcast({ method: 'x', args: [1], event: true } as any)
    expect(queue).toHaveLength(1)

    const broadcast = vi.fn(async () => {})
    kit = { rpc: { broadcast } }
    flushPendingHostCalls(queue)
    await promise

    expect(broadcast).toHaveBeenCalledWith({ method: 'x', args: [1], event: true })
    expect(opts.onLegacyBroadcast).not.toHaveBeenCalled()
  })

  it('warns and forwards when the legacy broadcast proxy is accessed', () => {
    const legacyFn = vi.fn()
    const opts = rpcOptions({ legacyBroadcast: { refresh: legacyFn } })
    const rpc = createConnectSafeRpc(() => undefined, [], opts)

    const fn = (rpc.broadcast as any).refresh
    expect(opts.onLegacyBroadcast).toHaveBeenCalledWith('refresh')
    expect(fn).toBe(legacyFn)
  })

  it('warns when the legacy functions proxy is accessed', () => {
    const opts = rpcOptions({ legacyFunctions: { foo: 1 } })
    const rpc = createConnectSafeRpc(() => undefined, [], opts)

    // eslint-disable-next-line ts/no-unused-expressions
    ;(rpc.functions as any).foo
    expect(opts.onLegacyFunctions).toHaveBeenCalled()
  })

  it('buffers register and forwards it once connected', () => {
    let kit: any
    const queue: (() => void)[] = []
    const rpc = createConnectSafeRpc(() => kit?.rpc, queue, rpcOptions())

    rpc.register({ name: 'foo', handler: () => {} } as any)
    expect(queue).toHaveLength(1)

    const register = vi.fn()
    kit = { rpc: { register } }
    flushPendingHostCalls(queue)
    expect(register).toHaveBeenCalledWith({ name: 'foo', handler: expect.any(Function) })
  })
})
