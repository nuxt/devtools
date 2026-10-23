import { describe, expect, it } from 'vitest'
import { isDevtoolsShortcut, resolveShortcutCodes } from '../src/runtime/shared/shortcut'

function createEvent(overrides: Partial<Parameters<typeof isDevtoolsShortcut>[0]> = {}) {
  return {
    altKey: true,
    shiftKey: true,
    code: 'KeyD',
    key: 'd',
    keyCode: 68,
    ...overrides,
  }
}

// Physical `KeyW` on a Workman layout. Option turns the produced `d` into `Î`,
// but the key code stays the one for the letter D.
const workmanD = createEvent({
  code: 'KeyW',
  key: 'Î',
})

describe('isDevtoolsShortcut', () => {
  it('matches Shift + Alt + D on a QWERTY layout', () => {
    expect(isDevtoolsShortcut(createEvent(), { shift: true })).toBe(true)
  })

  it('matches the QWERTY position even when Option rewrites the key', () => {
    expect(isDevtoolsShortcut(createEvent({ key: 'Î' }), { shift: true })).toBe(true)
  })

  it('matches the key that types d on a non-QWERTY layout', () => {
    const codes = resolveShortcutCodes(new Map([['KeyW', 'd'], ['KeyD', 's']]))
    expect(isDevtoolsShortcut(workmanD, { shift: true, codes })).toBe(true)
  })

  it('ignores the physical QWERTY position when it types another letter', () => {
    const codes = resolveShortcutCodes(new Map([['KeyD', 's'], ['KeyG', 'd']]))
    expect(isDevtoolsShortcut(createEvent({ code: 'KeyD', key: 'S', keyCode: 83 }), { shift: true, codes })).toBe(false)
  })

  it('falls back to the legacy key code when the Keyboard API is unavailable', () => {
    expect(isDevtoolsShortcut(workmanD, { shift: true })).toBe(true)
  })

  it('matches the produced key where Option does not rewrite it', () => {
    expect(isDevtoolsShortcut(createEvent({ code: 'KeyG', key: 'd', keyCode: 0 }), { shift: true })).toBe(true)
  })

  it('ignores keys that do not type d', () => {
    expect(isDevtoolsShortcut(createEvent({ code: 'KeyS', key: 's', keyCode: 83 }), { shift: true })).toBe(false)
  })

  it('requires Alt', () => {
    expect(isDevtoolsShortcut(createEvent({ altKey: false }), { shift: true })).toBe(false)
  })

  it('requires Shift when opening', () => {
    expect(isDevtoolsShortcut(createEvent({ shiftKey: false }), { shift: true })).toBe(false)
  })

  it('allows Shift to be optional when closing', () => {
    expect(isDevtoolsShortcut(createEvent({ shiftKey: false }))).toBe(true)
    expect(isDevtoolsShortcut(createEvent())).toBe(true)
  })

  it('ignores Ctrl and Meta combinations', () => {
    expect(isDevtoolsShortcut(createEvent({ ctrlKey: true }), { shift: true })).toBe(false)
    expect(isDevtoolsShortcut(createEvent({ metaKey: true }), { shift: true })).toBe(false)
  })
})

describe('resolveShortcutCodes', () => {
  it('adds every code that types d in the active layout', () => {
    const codes = resolveShortcutCodes(new Map([['KeyW', 'd'], ['KeyG', 'D'], ['KeyS', 's']]))
    expect([...codes].sort()).toEqual(['KeyG', 'KeyW'])
  })

  it('does not keep physical positions that do not type d', () => {
    const codes = resolveShortcutCodes(new Map([['KeyD', 's'], ['KeyG', 'd']]))
    expect(codes.has('KeyD')).toBe(false)
    expect(codes.has('KeyG')).toBe(true)
  })

  it('returns an empty set when the layout has no letter d', () => {
    expect(resolveShortcutCodes(new Map()).size).toBe(0)
  })
})
