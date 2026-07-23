import type { Nuxt } from 'nuxt/schema'
import type { ResolvedConfig } from 'vite'
import {
  getDataSource,
  resetDataSources,
  resolveSourceData,
} from '@devframes/plugin-data-inspector/registry'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getServerData,
  resetCapturedServerData,
  setup,
} from '../src/integrations/data-inspector'

interface FakeNuxt {
  nuxt: Nuxt
  callHook: (name: string, ...args: any[]) => Promise<void>
}

function fakeNuxt(options: Record<string, any> = { appId: 'test' }): FakeNuxt {
  const hooks = new Map<string, ((...args: any[]) => any)[]>()
  const nuxt = {
    options,
    // `deprecate()` reads `nuxt.devtools`; an empty object routes to the
    // fallback diagnostics state (console reporter).
    devtools: {},
    hook(name: string, fn: (...args: any[]) => any) {
      const list = hooks.get(name) ?? []
      list.push(fn)
      hooks.set(name, list)
    },
  } as unknown as Nuxt
  return {
    nuxt,
    async callHook(name, ...args) {
      for (const fn of hooks.get(name) ?? [])
        await fn(...args)
    },
  }
}

/** Minimal Vite ResolvedConfig stub sufficient for capture + normalization. */
function fakeViteConfig(overrides: Partial<ResolvedConfig> = {}): ResolvedConfig {
  return {
    env: { MODE: 'test' },
    plugins: [{ name: 'p', api: { secret: 1 } }],
    inlineConfig: { some: 'thing' },
    marker: 'raw',
    ...overrides,
  } as unknown as ResolvedConfig
}

/** Drive Nuxt's `vite:configResolved` hook for one environment. */
async function captureViteEnv(fake: FakeNuxt, envName: 'client' | 'ssr', config: ResolvedConfig) {
  await fake.callHook('vite:configResolved', config, {
    isClient: envName === 'client',
    isServer: envName === 'ssr',
  })
}

beforeEach(() => {
  resetDataSources()
  resetCapturedServerData()
})

describe('data-inspector source registration', () => {
  it('registers exactly one non-static `nuxt:application` source', () => {
    const { nuxt } = fakeNuxt()
    setup({ nuxt } as any)

    const entry = getDataSource('nuxt:application')
    expect(entry).toBeDefined()
    expect(entry!.title).toBe('Nuxt Application')
    expect(entry!.description).toBe('Live Nuxt, Nitro, and Vite configuration')
    expect(entry!.icon).toBe('i-ph:database-duotone')
    expect(entry!.static).toBe(false)
    expect(typeof entry!.data).toBe('function')
  })

  it('exposes the four read-only suggested queries with function exclusion', () => {
    const { nuxt } = fakeNuxt()
    setup({ nuxt } as any)

    const queries = getDataSource('nuxt:application')!.queries!
    expect(queries).toEqual([
      { title: 'Overview', query: '', excludeFunctions: true },
      { title: 'Nuxt options', query: 'nuxt', excludeFunctions: true },
      { title: 'Nitro options', query: 'nitro', excludeFunctions: true },
      { title: 'Vite configs', query: 'vite', excludeFunctions: true },
    ])
  })

  it('returns Nuxt options immediately, with Nitro/Vite empty before capture', async () => {
    const options = { appId: 'app', rootDir: '/app' }
    const { nuxt } = fakeNuxt(options)
    setup({ nuxt } as any)

    const data = await resolveSourceData(getDataSource('nuxt:application')!) as any
    expect(data.nuxt).toBe(options)
    expect(data.nitro).toBeUndefined()
    expect(data.vite).toEqual({ client: undefined, ssr: undefined })
  })

  it('populates Nitro and raw Vite configs after the hooks fire', async () => {
    const fake = fakeNuxt()
    setup({ nuxt: fake.nuxt } as any)

    const nitro = { options: { preset: 'node' } }
    await fake.callHook('nitro:build:before', nitro)

    const client = fakeViteConfig({ marker: 'client' } as any)
    const ssr = fakeViteConfig({ marker: 'ssr' } as any)
    await captureViteEnv(fake, 'client', client)
    await captureViteEnv(fake, 'ssr', ssr)

    const data = await resolveSourceData(getDataSource('nuxt:application')!) as any
    expect(data.nitro).toBe(nitro.options)
    // The live source hands the RAW config objects to the Data Inspector engine.
    expect(data.vite.client).toBe(client)
    expect(data.vite.ssr).toBe(ssr)
  })

  it('unregisters the source on the Nuxt `close` hook', async () => {
    const { nuxt, callHook } = fakeNuxt()
    setup({ nuxt } as any)
    expect(getDataSource('nuxt:application')).toBeDefined()

    await callHook('close')
    expect(getDataSource('nuxt:application')).toBeUndefined()
  })
})

describe('getServerData deprecated shim', () => {
  it('returns the legacy `vite: { server, client }` shape with normalized configs', async () => {
    const options = { appId: 'app' }
    const fake = fakeNuxt(options)
    setup({ nuxt: fake.nuxt } as any)

    const nitro = { options: { preset: 'node' } }
    await fake.callHook('nitro:build:before', nitro)
    await captureViteEnv(fake, 'client', fakeViteConfig())
    await captureViteEnv(fake, 'ssr', fakeViteConfig())

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const data = getServerData(fake.nuxt)
    warn.mockRestore()

    expect(data.nuxt).toBe(options)
    expect(data.nitro).toBe(nitro.options)
    // Legacy field naming: `ssr` capture maps to `vite.server`.
    expect(data.vite).toHaveProperty('server')
    expect(data.vite).toHaveProperty('client')
    // Normalization strips the live Vite branches for RPC transport.
    expect(data.vite.server!.inlineConfig).toBeNull()
    expect((data.vite.server!.plugins[0] as any).api).toBeUndefined()
  })

  it('emits the NDT_DEP_0009 deprecation once per process', () => {
    const { nuxt } = fakeNuxt()
    setup({ nuxt } as any)

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    getServerData(nuxt)
    getServerData(nuxt)
    const outputs = warn.mock.calls.map(c => String(c[0])).filter(o => o.includes('NDT_DEP_0009'))
    warn.mockRestore()

    expect(outputs).toHaveLength(1)
    expect(outputs[0]).toContain('`getServerData()` is deprecated')
  })
})
