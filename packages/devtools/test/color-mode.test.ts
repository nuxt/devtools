import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  COLOR_MODE_OVERRIDE_STORAGE_KEY,
  COLOR_MODE_STORAGE_KEY,
  shouldApplyHostColorMode,
} from '../client/composables/color-mode'

describe('shouldApplyHostColorMode', () => {
  const values = new Map<string, string>()

  beforeEach(() => {
    values.clear()
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('follows the host app on a fresh install', () => {
    expect(shouldApplyHostColorMode()).toBe(true)
    expect(values.get(COLOR_MODE_OVERRIDE_STORAGE_KEY)).toBe('false')
  })

  it('follows the host app when the stored mode is auto', () => {
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, 'auto')

    expect(shouldApplyHostColorMode()).toBe(true)
    expect(values.get(COLOR_MODE_OVERRIDE_STORAGE_KEY)).toBe('false')
  })

  it('keeps an explicit DevTools choice', () => {
    localStorage.setItem(COLOR_MODE_OVERRIDE_STORAGE_KEY, 'true')

    expect(shouldApplyHostColorMode()).toBe(false)
    expect(values.get(COLOR_MODE_OVERRIDE_STORAGE_KEY)).toBe('true')
  })

  it('keeps following the host app after a host sync', () => {
    localStorage.setItem(COLOR_MODE_OVERRIDE_STORAGE_KEY, 'false')

    expect(shouldApplyHostColorMode()).toBe(true)
  })

  it.each(['light', 'dark'])('preserves a legacy %s preference', (mode) => {
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, mode)

    expect(shouldApplyHostColorMode()).toBe(false)
    expect(values.get(COLOR_MODE_OVERRIDE_STORAGE_KEY)).toBe('true')
  })

  it('fails safely when storage is unavailable', () => {
    vi.stubGlobal('localStorage', {
      getItem() {
        throw new Error('blocked')
      },
      setItem() {
        throw new Error('blocked')
      },
    })

    expect(shouldApplyHostColorMode()).toBe(true)
  })
})
