import type { Plugin } from 'vite'
import { buildOtpAuthUrl } from 'devframe/node/auth'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { fakeNuxt } from './fake-nuxt'

const mocks = vi.hoisted(() => ({
  vitePlugins: [] as Plugin[],
}))

vi.mock('@vitejs/devtools', () => ({
  DevTools: vi.fn(() => []),
}))

vi.mock('@nuxt/kit', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@nuxt/kit')>()
  return {
    ...actual,
    addImports: vi.fn(),
    addPlugin: vi.fn(),
    addTemplate: vi.fn(),
    addVitePlugin: vi.fn((plugin: Plugin | Plugin[]) => {
      mocks.vitePlugins.push(...(Array.isArray(plugin) ? plugin : [plugin]))
    }),
    extendViteConfig: vi.fn(),
  }
})

afterEach(() => {
  mocks.vitePlugins.length = 0
  vi.unstubAllEnvs()
})

describe('vite DevTools origin', () => {
  it('builds the auth URL from the public Nuxt server rather than its internal Vite port', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('TEST', '')
    const nuxt = fakeNuxt()
    const { enableModule } = await import('../src/module-main')

    await enableModule({
      dataInspector: false,
      viteInspect: false,
      componentInspector: false,
      vueDevTools: false,
      codeServer: { enabled: false },
    } as any, nuxt)

    await nuxt.callHook('listen', {} as any, { url: 'http://localhost:3000/__nuxt_devtools__/client/' } as any)

    const plugin = mocks.vitePlugins.find(plugin => plugin.name === 'nuxt:devtools') as any
    const ctx = {
      viteConfig: { command: 'serve', build: { ssr: false } },
      host: { resolveOrigin: () => 'http://localhost:5173' },
      docks: { register: vi.fn() },
      rpc: {
        register: vi.fn(),
        has: vi.fn(() => false),
        update: vi.fn(),
        broadcast: vi.fn(),
      },
    }

    await plugin.devtools.setup(ctx)

    expect(buildOtpAuthUrl(ctx.host.resolveOrigin(), '881725'))
      .toBe('http://localhost:3000/#devframe_otp=881725')
  })
})
