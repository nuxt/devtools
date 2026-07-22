import type { ViteDevToolsNodeContext } from '@vitejs/devtools-kit'
import type { Nuxt } from 'nuxt/schema'
import { runWithNuxtContext } from '@nuxt/kit'
import { createHooks } from 'hookable'
import { describe, expect, it } from 'vitest'
import { setupRPC } from '../src/server-rpc'

/**
 * A minimal `Nuxt` fixture: just enough `options` for every RPC sub-module
 * `setupRPC()` wires up to read synchronously at setup time (they only
 * register hooks / access `nuxt.options` — no filesystem or Vite server is
 * touched by connecting a kit context in these tests).
 */
function fakeNuxt(): Nuxt {
  const hooks = createHooks()
  return {
    options: {
      rootDir: '/tmp/fixture-app',
      srcDir: '/tmp/fixture-app',
      dir: { public: 'public', app: 'app' },
      app: { baseURL: '/' },
      _layers: [],
      analyzeDir: '/tmp/fixture-app/.nuxt/analyze',
      runtimeConfig: {},
      future: { compatibilityVersion: 4 },
      _nuxtConfigFile: '/tmp/fixture-app/nuxt.config.ts',
      build: {},
      vite: {},
    },
    vfs: {},
    hooks,
    hook: hooks.hook.bind(hooks),
    callHook: hooks.callHook.bind(hooks),
  } as unknown as Nuxt
}

/** A fake connecting `ViteDevToolsNodeContext`: only what `connectDevToolsKit` reads. */
function fakeKitCtx(viteConfig: ViteDevToolsNodeContext['viteConfig']): ViteDevToolsNodeContext {
  return {
    viteConfig,
    rpc: {
      register: () => {},
      has: () => false,
      update: () => {},
      broadcast: () => {},
    },
  } as unknown as ViteDevToolsNodeContext
}

const clientConfig = { command: 'serve', build: { ssr: false } } as ViteDevToolsNodeContext['viteConfig']
const ssrConfig = { command: 'build', build: { ssr: true } } as ViteDevToolsNodeContext['viteConfig']

function setup() {
  const nuxt = fakeNuxt()
  const { connectDevToolsKit } = runWithNuxtContext(nuxt, () => setupRPC(nuxt, {} as any))
  const readyContexts: ViteDevToolsNodeContext[] = []
  nuxt.hook('devtools:ready', (ctx) => {
    readyContexts.push(ctx)
  })
  // `setupRPC` assigns the live server context (with a `devtoolsKit` getter)
  // onto `nuxt.devtools` — read the connected kit context back through it.
  const getConnectedKit = () => (nuxt as any).devtools.devtoolsKit as ViteDevToolsNodeContext | undefined
  return { nuxt, connectDevToolsKit, getConnectedKit, readyContexts }
}

describe('connectDevToolsKit', () => {
  it('connects the client candidate and fires devtools:ready once', async () => {
    const { connectDevToolsKit, getConnectedKit, readyContexts } = setup()
    const clientCtx = fakeKitCtx(clientConfig)

    await connectDevToolsKit(clientCtx)

    expect(readyContexts).toEqual([clientCtx])
    expect(getConnectedKit()).toBe(clientCtx)
  })

  it('ignores the SSR candidate without connecting', async () => {
    const { connectDevToolsKit, getConnectedKit, readyContexts } = setup()
    const ssrCtx = fakeKitCtx(ssrConfig)

    await connectDevToolsKit(ssrCtx)

    expect(readyContexts).toEqual([])
    expect(getConnectedKit()).toBeUndefined()
  })

  it('connects a candidate with a missing/falsy build.ssr, even outside "serve"', async () => {
    // `skipInSSR` only reads `build.ssr` — any other candidate is treated as
    // the client rather than logged and ignored.
    const { connectDevToolsKit, getConnectedKit, readyContexts } = setup()
    const ambiguousCtx = fakeKitCtx({ command: 'build', build: {} } as ViteDevToolsNodeContext['viteConfig'])

    await connectDevToolsKit(ambiguousCtx)

    expect(readyContexts).toEqual([ambiguousCtx])
    expect(getConnectedKit()).toBe(ambiguousCtx)
  })

  it('connects the client candidate when the SSR candidate arrives first', async () => {
    const { connectDevToolsKit, getConnectedKit, readyContexts } = setup()
    const ssrCtx = fakeKitCtx(ssrConfig)
    const clientCtx = fakeKitCtx(clientConfig)

    await connectDevToolsKit(ssrCtx)
    await connectDevToolsKit(clientCtx)

    expect(readyContexts).toEqual([clientCtx])
    expect(getConnectedKit()).toBe(clientCtx)
  })

  it('connects the client candidate when the client candidate arrives first', async () => {
    const { connectDevToolsKit, getConnectedKit, readyContexts } = setup()
    const ssrCtx = fakeKitCtx(ssrConfig)
    const clientCtx = fakeKitCtx(clientConfig)

    await connectDevToolsKit(clientCtx)
    await connectDevToolsKit(ssrCtx)

    expect(readyContexts).toEqual([clientCtx])
    expect(getConnectedKit()).toBe(clientCtx)
  })

  it('ignores a second, repeated client candidate once connected', async () => {
    const { connectDevToolsKit, getConnectedKit, readyContexts } = setup()
    const firstClientCtx = fakeKitCtx(clientConfig)
    const secondClientCtx = fakeKitCtx(clientConfig)

    await connectDevToolsKit(firstClientCtx)
    await connectDevToolsKit(secondClientCtx)

    expect(readyContexts).toEqual([firstClientCtx])
    expect(getConnectedKit()).toBe(firstClientCtx)
  })
})
