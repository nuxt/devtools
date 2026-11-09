import { isAbsolute } from 'node:path'
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

async function enableDevtools(nuxt = fakeNuxt()) {
  vi.stubEnv('NODE_ENV', 'development')
  vi.stubEnv('TEST', '')
  const { enableModule } = await import('../src/module-main')
  await enableModule({
    dataInspector: false,
    viteInspect: false,
    componentInspector: false,
    vueDevTools: false,
    codeServer: { enabled: false },
  } as any, nuxt)
  return nuxt.options.vite.optimizeDeps?.include
}

describe('optimizeDeps.include', () => {
  it('resolves injected client deps from @nuxt/devtools', async () => {
    const include = await enableDevtools()

    expect(include).toHaveLength(4)
    for (const entry of include!) {
      expect(isAbsolute(entry)).toBe(true)
    }
    expect(include![0]).toMatch(/@vitejs\/devtools-kit\/dist\/client\.(?:m|c)?js$/)
    expect(include![1]).toMatch(/error-stack-parser-es\/dist\/index\.mjs$/)
    expect(include![2]).toMatch(/vite-plugin-vue-devtools\/dist\/client\.mjs$/)
    expect(include![3]).toMatch(/vite-plugin-vue-tracer\/dist\/client\/overlay\.mjs$/)
  })
})
