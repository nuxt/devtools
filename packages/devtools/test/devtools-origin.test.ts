import type { Nuxt } from 'nuxt/schema'
import type { Plugin } from 'vite'
import { fileURLToPath } from 'node:url'
import { buildOtpAuthUrl } from 'devframe/node/auth'
import { createHooks } from 'hookable'
import { afterEach, describe, expect, it, vi } from 'vitest'

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

function fakeNuxt(): Nuxt {
  const hooks = createHooks()
  const clientDir = fileURLToPath(new URL('../client', import.meta.url))
  return {
    options: {
      rootDir: clientDir,
      srcDir: clientDir,
      builder: '@nuxt/vite-builder',
      dev: true,
      test: false,
      dir: { public: 'public', app: 'app' },
      app: { baseURL: '/' },
      _layers: [],
      analyzeDir: '/tmp/fixture-app/.nuxt/analyze',
      runtimeConfig: {},
      future: { compatibilityVersion: 4 },
      _nuxtConfigFile: '/tmp/fixture-app/nuxt.config.ts',
      build: {},
      imports: {},
      vite: {},
    },
    vfs: {},
    hooks,
    hook: hooks.hook.bind(hooks),
    callHook: hooks.callHook.bind(hooks),
  } as unknown as Nuxt
}

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
