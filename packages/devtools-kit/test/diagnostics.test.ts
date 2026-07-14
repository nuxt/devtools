import type { Nuxt } from 'nuxt/schema'
import { describe, expect, it, vi } from 'vitest'
import {
  consoleDiagnostics,
  deprecate,
  diagnosticCodes,
  diagnosticsDocsBase,
  registerHostDiagnostics,
} from '../src/diagnostics'

function fakeNuxt(devtools: unknown = {}): Nuxt {
  return { devtools } as unknown as Nuxt
}

describe('diagnosticsDocsBase', () => {
  it('builds per-code migration-guide anchors (lowercased)', () => {
    expect(diagnosticsDocsBase('NDT_DEP_0001')).toBe(
      'https://devtools.nuxt.com/module/migration-v4#ndt_dep_0001',
    )
  })
})

describe('diagnosticCodes', () => {
  it('defines the deprecation codes', () => {
    expect(Object.keys(diagnosticCodes)).toEqual([
      'NDT_DEP_0001',
      'NDT_DEP_0003',
      'NDT_DEP_0004',
      'NDT_DEP_0005',
      'NDT_DEP_0006',
      'NDT_DEP_0007',
    ])
  })
})

describe('deprecate', () => {
  it('emits a warn-level diagnostic to the console before connect', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const diagnostic = deprecate(fakeNuxt(), 'NDT_DEP_0001', { api: 'a()', replacement: 'b()' })

    expect(warn).toHaveBeenCalledOnce()
    const output = String(warn.mock.calls[0]![0])
    expect(output).toContain('NDT_DEP_0001')
    expect(output).toContain('`a()` is deprecated')
    expect(output).toContain('Use `b()` instead')
    expect(output).toContain('migration-v4#ndt_dep_0001')
    expect(diagnostic).toBeInstanceOf(Error)
    warn.mockRestore()
  })

  it('routes method:error to console.error (error path)', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const diagnostic = deprecate(
      fakeNuxt(),
      'NDT_DEP_0003',
      { api: 'x', replacement: 'y' },
      { method: 'error' },
    )

    expect(error).toHaveBeenCalledOnce()
    expect(warn).not.toHaveBeenCalled()
    // The returned diagnostic can be thrown to abort (hard break).
    expect(() => {
      throw diagnostic
    }).toThrow()
    error.mockRestore()
    warn.mockRestore()
  })

  it('dedupes per code+key, and re-emits for a distinct key', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const nuxt = fakeNuxt()

    deprecate(nuxt, 'NDT_DEP_0001', { api: 'a', replacement: 'b' })
    const second = deprecate(nuxt, 'NDT_DEP_0001', { api: 'a', replacement: 'b' })

    expect(warn).toHaveBeenCalledOnce()
    expect(second).toBeUndefined()

    deprecate(nuxt, 'NDT_DEP_0001', { api: 'a', replacement: 'b' }, { key: 'other-call-site' })
    expect(warn).toHaveBeenCalledTimes(2)
    warn.mockRestore()
  })

  it('routes through the host catalog once the kit has connected', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const handle = vi.fn()
    const hostCatalog = { NDT_DEP_0001: handle, NDT_DEP_0003: vi.fn() }
    const register = vi.fn()
    const defineDiagnostics = vi.fn(() => hostCatalog)
    const ctx = {
      devtoolsKit: { diagnostics: { logger: {}, register, defineDiagnostics } },
    }

    registerHostDiagnostics(ctx as any)
    expect(defineDiagnostics).toHaveBeenCalledOnce()
    expect(register).toHaveBeenCalledWith(hostCatalog)

    deprecate(fakeNuxt(ctx), 'NDT_DEP_0001', { api: 'a', replacement: 'b' })

    expect(handle).toHaveBeenCalledOnce()
    expect(handle).toHaveBeenCalledWith({ api: 'a', replacement: 'b' }, { method: 'warn' })
    // Did not fall back to the console catalog — single emission.
    expect(warn).not.toHaveBeenCalled()
    warn.mockRestore()
  })
})

describe('consoleDiagnostics', () => {
  it('produces a throwable Diagnostic (extends Error)', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const diagnostic = consoleDiagnostics.NDT_DEP_0001({ api: 'a', replacement: 'b' })
    expect(diagnostic).toBeInstanceOf(Error)
    warn.mockRestore()
  })
})

describe('registerHostDiagnostics', () => {
  it('is a no-op when no diagnostics host is available', () => {
    expect(() => registerHostDiagnostics({ devtoolsKit: undefined } as any)).not.toThrow()
  })
})
