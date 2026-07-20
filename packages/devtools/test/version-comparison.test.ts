import { isGreaterOrEqual, isLess, satisfies } from 'verkit'
import { describe, expect, it } from 'vitest'

describe('version comparisons', () => {
  it('checks the minimum supported unimport version', () => {
    expect(isGreaterOrEqual('3.1.0', '3.1.0')).toBe(true)
    expect(isGreaterOrEqual('3.0.9', '3.1.0')).toBe(false)
  })

  it('detects stable and prerelease package updates', () => {
    expect(isLess('4.0.0', '4.0.1')).toBe(true)
    expect(isLess('4.0.0-alpha.1', '4.0.0')).toBe(true)
    expect(isLess('4.0.1', '4.0.0')).toBe(false)
  })

  it('preserves default prerelease range behavior', () => {
    expect(satisfies('4.0.0-alpha.7', '^4.0.0-alpha.1')).toBe(true)
    expect(satisfies('4.0.0-alpha.7', '^4.0.0')).toBe(false)
  })

  it('rejects invalid comparison inputs', () => {
    expect(() => isLess('invalid', '4.0.0')).toThrow(TypeError)
    expect(() => isGreaterOrEqual('invalid', '3.1.0')).toThrow(TypeError)
    expect(satisfies('invalid', '^4.0.0')).toBe(false)
  })
})
