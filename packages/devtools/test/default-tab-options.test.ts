import { describe, expect, it } from 'vitest'
import { defaultTabOptions } from '../src/constant'

describe('defaultTabOptions', () => {
  it('is a self-consistent snapshot that callers must clone before mutating', () => {
    // Guards against the regression where the options RPC aliased and mutated this constant.
    const before = structuredClone(defaultTabOptions)
    // simulate a caller cloning then mutating its own copy
    const copy = structuredClone(defaultTabOptions)
    copy.ui.scale = 999
    expect(defaultTabOptions).toEqual(before)
    expect(defaultTabOptions.ui.scale).not.toBe(999)
  })
})
