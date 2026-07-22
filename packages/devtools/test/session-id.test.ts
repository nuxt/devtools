import { describe, expect, it } from 'vitest'
import { createUniqueSessionId } from '../src/utils/session-id'

describe('createUniqueSessionId', () => {
  it('keeps the readable base id as a prefix', () => {
    expect(createUniqueSessionId('devtools:analyze-build')).toMatch(/^devtools:analyze-build#/)
  })

  it('never repeats an id for the same base', () => {
    const base = 'nuxt:add-module:foo'
    const ids = Array.from({ length: 50 }, () => createUniqueSessionId(base))
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('produces distinct ids across different bases', () => {
    const a = createUniqueSessionId('a')
    const b = createUniqueSessionId('b')
    expect(a).not.toBe(b)
    expect(a.startsWith('a#')).toBe(true)
    expect(b.startsWith('b#')).toBe(true)
  })
})
