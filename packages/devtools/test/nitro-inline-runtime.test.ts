import { afterEach, describe, expect, it, vi } from 'vitest'
import { fakeNuxt } from './fake-nuxt'

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
    addVitePlugin: vi.fn(),
    extendViteConfig: vi.fn(),
  }
})

afterEach(() => {
  vi.unstubAllEnvs()
})

async function nitroConfigAfterSetup<T extends object>(config: T): Promise<T> {
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
  await nuxt.callHook('nitro:config', config as any)
  return config
}

describe('inlining the nitro runtime plugin', () => {
  it('uses externals.inline on Nitro v2 and leaves its boolean noExternals alone', async () => {
    const config = await nitroConfigAfterSetup({ externals: { inline: ['vue'] } } as { externals: { inline: string[] }, noExternals?: boolean })

    expect(config.externals.inline).toEqual(['vue', expect.stringMatching(/runtime[\\/]nitro$/)])
    expect(config.noExternals).toBeUndefined()
  })

  it('appends to the noExternals list on Nitro v3', async () => {
    const config = await nitroConfigAfterSetup({ noExternals: ['nuxt/dist'] } as { noExternals: (string | RegExp)[], externals?: object })

    expect(config.noExternals).toEqual(['nuxt/dist', expect.stringMatching(/runtime[\\/]nitro$/)])
    expect(config.externals).toBeUndefined()
  })
})
