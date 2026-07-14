import { describe, expect, it } from 'vitest'
import { toJsLiteral } from '../src/utils/serialize-js-literal'

describe('toJsLiteral', () => {
  it('serializes primitives', () => {
    expect(toJsLiteral(null)).toBe('null')
    expect(toJsLiteral(undefined)).toBe('undefined')
    expect(toJsLiteral(42)).toBe('42')
    expect(toJsLiteral(true)).toBe('true')
    expect(toJsLiteral('a"b')).toBe('"a\\"b"')
  })

  it('serializes arrays and objects', () => {
    expect(toJsLiteral([1, 2])).toBe('[1, 2]')
    expect(toJsLiteral({ a: 1 })).toBe('{ a: 1 }')
    expect(toJsLiteral({})).toBe('{}')
  })

  it('quotes non-identifier keys', () => {
    expect(toJsLiteral({ 'a-b': 1 })).toBe('{ "a-b": 1 }')
  })
})
