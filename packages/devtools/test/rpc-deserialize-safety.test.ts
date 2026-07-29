import { parse, stringify } from 'structured-clone-es'
import { describe, expect, it } from 'vitest'

// The RPC channel deserializes untrusted frames from the Vite HMR WebSocket
// with structured-clone-es. Before 2.0.1 its type-7 branch ran
// `new globalThis[name](message)`, so a crafted frame could deserialize into a
// real `new Function("<attacker body>")` — a code-execution primitive once
// birpc assimilated it (await on a return value / resolve on a response).
// 2.0.1 allowlists constructors, which is the fix this suite pins in place.
describe('structured-clone-es deserialization is hardened (>=2.0.1)', () => {
  it('never constructs a callable from a type-7 "Function" payload', () => {
    const records = [[7, { name: 'Function', message: 'return globalThis' }]]
    const result = parse(JSON.stringify(records))
    expect(typeof result).not.toBe('function')
    // unsafe constructor names fall back to a plain Error
    expect(result).toBeInstanceOf(Error)
  })

  it('never constructs a callable smuggled as a `then` (thenable assimilation)', () => {
    const records = [
      [2, [[1, 2]]], // { then: <value> }
      [0, 'then'],
      [7, { name: 'Function', message: 'globalThis.__pwned = true' }],
    ]
    const result = parse(JSON.stringify(records)) as { then?: unknown }
    expect(typeof result.then).not.toBe('function')
  })

  it('rejects unknown/unsafe constructor types instead of instantiating them', () => {
    const records = [['Function', 'return globalThis']]
    expect(() => parse(JSON.stringify(records))).toThrow(/unsafe or unknown type/i)
  })

  it('still round-trips legitimate RPC payloads', () => {
    const message = { t: 'q', m: 'getOptions', a: ['ui'], i: 'abc' }
    expect(parse(stringify(message))).toEqual(message)
  })
})
