import { parse } from 'structured-clone-es'
import { describe, expect, it } from 'vitest'
import { deserializeRpc, serializeRpc } from '../src/utils/rpc-serialize'

// structured-clone-es wire records that reconstruct `new globalThis[name](message)`.
// With name = "Function" this compiles an attacker-controlled callable.
function functionGadgetRecords(body: string) {
  return [[7, { name: 'Function', message: body }]]
}

// An object `{ then: <function> }` — the thenable-assimilation gadget.
function thenableGadgetRecords(body: string) {
  return [
    [2, [[1, 2]]],
    [0, 'then'],
    [7, { name: 'Function', message: body }],
  ]
}

describe('rpc deserialize hardening', () => {
  it('round-trips legitimate RPC payloads unchanged', () => {
    const message = { t: 'q', m: 'getOptions', a: ['ui'], i: 'abc' }
    expect(deserializeRpc(serializeRpc(message))).toEqual(message)
  })

  it('confirms the raw deserializer constructs a real callable (the gadget)', () => {
    // Sanity check that the underlying primitive exists, so the guard below is
    // demonstrably doing something.
    const raw = parse(JSON.stringify(functionGadgetRecords('return 1')))
    expect(typeof raw).toBe('function')
  })

  it('drops a frame that deserializes to a top-level callable', () => {
    const hostile = JSON.stringify(functionGadgetRecords('return process.mainModule'))
    expect(deserializeRpc(hostile)).toEqual({})
  })

  it('drops a frame carrying a callable `then` (thenable assimilation)', () => {
    const hostile = JSON.stringify(thenableGadgetRecords('globalThis.__pwned = true'))
    const result = deserializeRpc(hostile)
    expect(result).toEqual({})
    expect(typeof (result as any).then).toBe('undefined')
  })

  it('drops a frame with a deeply nested callable', () => {
    const records = [
      [2, [[1, 2]]], // { r: <object> }
      [0, 'r'],
      [2, [[3, 4]]], // { then: <function> }
      [0, 'then'],
      [7, { name: 'Function', message: 'return 1' }],
    ]
    expect(deserializeRpc(JSON.stringify(records))).toEqual({})
  })

  it('preserves reconstructed Error values (no callable payload)', () => {
    const records = [[7, { name: 'TypeError', message: 'boom' }]]
    const result = deserializeRpc(JSON.stringify(records))
    expect(result).toBeInstanceOf(TypeError)
    expect((result as Error).message).toBe('boom')
  })
})
