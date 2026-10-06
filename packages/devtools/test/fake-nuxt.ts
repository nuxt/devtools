import type { Nuxt } from 'nuxt/schema'
import { fileURLToPath } from 'node:url'
import { createHooks } from 'hookable'

/** The minimum `Nuxt` shape `enableModule()` reads in dev mode. */
export function fakeNuxt(): Nuxt {
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
