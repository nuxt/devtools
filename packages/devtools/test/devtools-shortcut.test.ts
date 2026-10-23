import { afterEach, describe, expect, it, vi } from 'vitest'
import { isDevtoolsShortcut, resolveShortcutCodes } from '../src/runtime/shared/shortcut'

function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((r) => {
    resolve = r
  })
  return { promise, resolve }
}

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

describe('watchShortcutLayoutMap', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.resetModules()
  })

  it('ignores a stale result from an older layout request', async () => {
    vi.resetModules()
    const first = deferred<Map<string, string>>()
    const second = deferred<Map<string, string>>()
    const pending = [first.promise, second.promise]
    let onLayoutChange: (() => void) | undefined

    vi.stubGlobal('navigator', {
      keyboard: {
        getLayoutMap: () => pending.shift()!,
        addEventListener: (_type: string, listener: () => void) => {
          onLayoutChange = listener
        },
      },
    })

    const { isDevtoolsShortcut: isShortcut, watchShortcutLayoutMap } = await import('../src/runtime/shared/shortcut')

    watchShortcutLayoutMap()
    onLayoutChange?.()

    // The second request reflects the new layout and resolves first.
    second.resolve(new Map([['KeyG', 'd']]))
    await Promise.resolve()
    await Promise.resolve()

    // The first request belongs to the old layout and resolves last.
    first.resolve(new Map([['KeyD', 'd']]))
    await Promise.resolve()
    await Promise.resolve()

    const colemakD = { altKey: true, shiftKey: true, code: 'KeyG', key: 'x', keyCode: 0 }
    expect(isShortcut(colemakD, { shift: true })).toBe(true)
  })

  it('falls back to QWERTY when a layout refresh has no map', async () => {
    vi.resetModules()
    const first = deferred<Map<string, string>>()
    const second = deferred<Map<string, string>>()
    const pending = [first.promise, second.promise]
    let onLayoutChange: (() => void) | undefined

    vi.stubGlobal('navigator', {
      keyboard: {
        getLayoutMap: () => pending.shift()!,
        addEventListener: (_type: string, listener: () => void) => {
          onLayoutChange = listener
        },
      },
    })

    const { isDevtoolsShortcut: isShortcut, watchShortcutLayoutMap } = await import('../src/runtime/shared/shortcut')

    watchShortcutLayoutMap()
    first.resolve(new Map([['KeyW', 'd'], ['KeyD', 's']]))
    await Promise.resolve()
    await Promise.resolve()

    // Physical W types `d` on Workman.
    const physicalW = { altKey: true, shiftKey: true, code: 'KeyW', key: 'w', keyCode: 87 }
    expect(isShortcut(physicalW, { shift: true })).toBe(true)

    // The next layout is unknown, so W must no longer match as `d`.
    onLayoutChange?.()
    second.resolve(new Map())
    await Promise.resolve()
    await Promise.resolve()

    expect(isShortcut(physicalW, { shift: true })).toBe(false)
  })
})
