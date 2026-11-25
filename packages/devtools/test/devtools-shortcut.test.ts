import { describe, expect, it } from 'vitest'
import { isDevtoolsShortcut } from '../src/runtime/shared/shortcut'

function createEvent(overrides: Partial<Parameters<typeof isDevtoolsShortcut>[0]> = {}) {
  return {
    altKey: true,
    shiftKey: true,
    key: 'd',
    keyCode: 68,
    ...overrides,
  }
}

describe('isDevtoolsShortcut', () => {
  it('matches Shift + Alt + D on a QWERTY layout', () => {
    expect(isDevtoolsShortcut(createEvent())).toBe(true)
  })

  it('matches when Option rewrites the key on macOS', () => {
    expect(isDevtoolsShortcut(createEvent({ key: 'Î' }))).toBe(true)
  })

  it('matches Workman/Colemak via the legacy key code', () => {
    expect(isDevtoolsShortcut(createEvent({
      key: 'Î',
      keyCode: 68,
    }))).toBe(true)
  })

  it('matches the produced key where Option does not rewrite it', () => {
    expect(isDevtoolsShortcut(createEvent({ key: 'd', keyCode: 0 }))).toBe(true)
  })

  it('ignores keys that do not type d', () => {
    expect(isDevtoolsShortcut(createEvent({ key: 's', keyCode: 83 }))).toBe(false)
  })

  it('requires Alt', () => {
    expect(isDevtoolsShortcut(createEvent({ altKey: false }))).toBe(false)
  })

  it('requires Shift when opening', () => {
    expect(isDevtoolsShortcut(createEvent({ shiftKey: false }))).toBe(false)
  })

  it('allows Shift to be optional when closing', () => {
    expect(isDevtoolsShortcut(createEvent({ shiftKey: false }), false)).toBe(true)
    expect(isDevtoolsShortcut(createEvent(), false)).toBe(true)
  })

  it('ignores Ctrl and Meta combinations', () => {
    expect(isDevtoolsShortcut(createEvent({ ctrlKey: true }))).toBe(false)
    expect(isDevtoolsShortcut(createEvent({ metaKey: true }))).toBe(false)
  })
})
