import type { NuxtDevtoolsServerContext } from '../src/types'
import { createHooks } from 'hookable'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { setupVirtualFilesRPC } from '../src/server-rpc/virtual-files'
import { fakeNuxt } from './fake-nuxt'

function createContext(overrides?: {
  rootDir?: string
  buildDir?: string
  baseURL?: string
  vfs?: Record<string, string>
}) {
  const nuxt = fakeNuxt()
  if (overrides?.rootDir !== undefined)
    nuxt.options.rootDir = overrides.rootDir
  if (overrides?.buildDir !== undefined)
    nuxt.options.buildDir = overrides.buildDir
  if (overrides?.baseURL !== undefined)
    nuxt.options.app.baseURL = overrides.baseURL
  if (overrides?.vfs !== undefined)
    nuxt.vfs = overrides.vfs

  const refresh = vi.fn()
  const ctx = {
    nuxt,
    refresh,
  } as unknown as NuxtDevtoolsServerContext

  return {
    nuxt,
    refresh,
    rpc: setupVirtualFilesRPC(ctx),
  }
}

afterEach(() => {
  vi.useRealTimers()
})

describe('setupVirtualFilesRPC', () => {
  it('lists Nuxt virtual templates without duplicating buildDir or Windows backslash aliases', async () => {
    const buildDir = 'C:/repo/app/node_modules/.cache/nuxt/.nuxt'
    const { rpc } = createContext({
      rootDir: 'C:\\repo\\app\\',
      buildDir,
      baseURL: '/prefix/',
      vfs: {
        [`${buildDir}/nuxt.config.mjs`]: 'export default { baseURL: "/prefix/" }',
        '#build/nuxt.config.mjs': 'export default { baseURL: "/prefix/" }',
        'C:\\repo\\app\\node_modules\\.cache\\nuxt\\.nuxt\\nuxt.config.mjs': 'export default { baseURL: "/prefix/" }',
        'C:/repo/app/custom/generated.ts': 'export const custom = true',
        'C:\\repo\\app\\custom\\generated.ts': 'export const custom = true',
      },
    })

    const list = rpc.getVirtualFiles()
    expect(list.rootDir).toBe('C:/repo/app')
    expect(list.entries).toEqual([
      {
        id: '#build/nuxt.config.mjs',
        path: `${buildDir}/nuxt.config.mjs`,
      },
      {
        id: 'C:/repo/app/custom/generated.ts',
        path: 'C:/repo/app/custom/generated.ts',
      },
    ])

    await expect(rpc.getVirtualFile('#build/nuxt.config.mjs')).resolves.toEqual({
      id: '#build/nuxt.config.mjs',
      content: 'export default { baseURL: "/prefix/" }',
    })
    await expect(rpc.getVirtualFile(`${buildDir}/nuxt.config.mjs`)).resolves.toEqual({
      id: `${buildDir}/nuxt.config.mjs`,
      content: 'export default { baseURL: "/prefix/" }',
    })
  })

  it('supports Nitro v2 plain-object vfs and dynamic virtual modules', async () => {
    const { nuxt, rpc } = createContext({
      rootDir: '/srv/app',
      buildDir: '/srv/app/.nuxt',
      baseURL: '/subpath/',
      vfs: {
        '/srv/app/.nuxt/routes.mjs': 'export default []',
        '#build/routes.mjs': 'export default []',
      },
    })

    const nitroHooks = createHooks()
    await nuxt.callHook('nitro:init', {
      options: {
        rootDir: '/srv/app',
        virtual: {
          '#virtual/sync': () => 'export const sync = 1',
          '#virtual/async': async () => 'export const asyncVal = 2',
          '#virtual/override': 'from-options-virtual',
        },
      },
      vfs: {
        '#internal/nitro/virtual/polyfill': 'import "polyfill"',
        '#virtual/override': 'from-nitro-vfs',
      },
      hooks: nitroHooks,
    } as any)

    const ids = rpc.getVirtualFiles().entries.map(e => e.id)
    expect(ids).toEqual([
      '#build/routes.mjs',
      '#internal/nitro/virtual/polyfill',
      '#virtual/override',
      '#virtual/sync',
      '#virtual/async',
    ])

    await expect(rpc.getVirtualFile('#virtual/sync')).resolves.toEqual({
      id: '#virtual/sync',
      content: 'export const sync = 1',
    })
    await expect(rpc.getVirtualFile('#virtual/async')).resolves.toEqual({
      id: '#virtual/async',
      content: 'export const asyncVal = 2',
    })
    await expect(rpc.getVirtualFile('#virtual/override')).resolves.toEqual({
      id: '#virtual/override',
      content: 'from-options-virtual',
    })
    await expect(rpc.getVirtualFile('#internal/nitro/virtual/polyfill')).resolves.toEqual({
      id: '#internal/nitro/virtual/polyfill',
      content: 'import "polyfill"',
    })
  })

  it('supports Nitro v3 Map vfs alongside Nuxt templates and handles Nuxt 5 pre-build Map Proxy safely', async () => {
    const { nuxt, rpc } = createContext({
      rootDir: '/srv/app',
      buildDir: '/srv/app/node_modules/.cache/nuxt/.nuxt',
      vfs: {
        '#build/plugins.mjs': 'export default []',
        '#build/empty.mjs': '',
      },
    })

    const nitroHooks = createHooks()
    // Nuxt 5 wraps `nitro.vfs` (a Map) in a Proxy during `initNitro` before Nitro's build replaces it.
    const proxiedEmptyMap = new Proxy(new Map(), {
      get(target, prop) {
        return Reflect.get(target, prop) || {
          render: () => (nuxt.vfs as Record<PropertyKey, string>)[prop],
        }
      },
    })

    const nitroMock: any = {
      options: {
        rootDir: '/srv/app',
        virtual: {},
      },
      vfs: proxiedEmptyMap,
      hooks: nitroHooks,
    }

    await nuxt.callHook('nitro:init', nitroMock)

    // Must not throw `Method Map.prototype.keys called on incompatible receiver`
    expect(rpc.getVirtualFiles().entries.map(e => e.id)).toEqual([
      '#build/plugins.mjs',
      '#build/empty.mjs',
    ])
    await expect(rpc.getVirtualFile('#missing')).resolves.toBeUndefined()
    await expect(rpc.getVirtualFile('toString')).resolves.toBeUndefined()
    await expect(rpc.getVirtualFile('')).resolves.toBeUndefined()
    await expect(rpc.getVirtualFile('#build/empty.mjs')).resolves.toEqual({
      id: '#build/empty.mjs',
      content: '',
    })

    // Simulate Nitro v3 build replacing `nitro.vfs` with `virtualPlugin.api.modules` Map
    nitroMock.vfs = new Map([
      [
        '#nitro-internal-virtual/server-handlers',
        {
          render: async () => 'export const handlers = []',
        },
      ],
    ])

    expect(rpc.getVirtualFiles().entries.map(e => e.id)).toEqual([
      '#build/plugins.mjs',
      '#build/empty.mjs',
      '#nitro-internal-virtual/server-handlers',
    ])
    await expect(rpc.getVirtualFile('#nitro-internal-virtual/server-handlers')).resolves.toEqual({
      id: '#nitro-internal-virtual/server-handlers',
      content: 'export const handlers = []',
    })
  })

  it('refreshes getVirtualFiles on template generation and Nitro dev reloads until closed', async () => {
    vi.useFakeTimers()
    const { nuxt, refresh } = createContext({
      rootDir: '/srv/app',
      vfs: {},
    })

    await nuxt.callHook('app:templatesGenerated', {} as any, [], {} as any)
    await vi.advanceTimersByTimeAsync(600)
    expect(refresh).toHaveBeenCalledTimes(1)
    expect(refresh).toHaveBeenLastCalledWith('getVirtualFiles')

    const nitroHooks = createHooks()
    await nuxt.callHook('nitro:init', {
      options: { rootDir: '/srv/app' },
      vfs: new Map(),
      hooks: nitroHooks,
    } as any)
    await vi.advanceTimersByTimeAsync(600)
    expect(refresh).toHaveBeenCalledTimes(2)

    await nitroHooks.callHook('dev:reload')
    await vi.advanceTimersByTimeAsync(600)
    expect(refresh).toHaveBeenCalledTimes(3)

    await nuxt.callHook('close', nuxt)
    await nitroHooks.callHook('dev:reload')
    await vi.advanceTimersByTimeAsync(600)
    expect(refresh).toHaveBeenCalledTimes(3)
  })

  it('registers getVirtualFiles and getVirtualFile on ViteDevToolsNodeContext when app.baseURL is non-root', async () => {
    const { runWithNuxtContext } = await import('@nuxt/kit')
    const { RPC_NAMESPACE } = await import('../src/rpc-namespace')
    const { setupRPC } = await import('../src/server-rpc')

    const nuxt = fakeNuxt()
    nuxt.options.rootDir = '/srv/proxied-app'
    nuxt.options.buildDir = '/srv/proxied-app/.nuxt'
    nuxt.options.app.baseURL = '/prefix/'
    nuxt.vfs = {
      '/srv/proxied-app/.nuxt/nuxt.config.mjs': 'export default { app: { baseURL: "/prefix/" } }',
      '#build/nuxt.config.mjs': 'export default { app: { baseURL: "/prefix/" } }',
    }

    const registered = new Map<string, (...args: any[]) => any>()
    const { connectDevToolsKit } = runWithNuxtContext(nuxt, () => setupRPC(nuxt, {} as any))
    connectDevToolsKit({
      viteConfig: {
        command: 'serve',
        build: { ssr: false },
      },
      rpc: {
        register: (def: { name: string, handler: (...args: any[]) => any }) => {
          registered.set(def.name, def.handler)
        },
        has: (name: string) => registered.has(name),
        update: () => {},
        broadcast: () => {},
      },
    } as any)

    const getVirtualFiles = registered.get(`${RPC_NAMESPACE}:getVirtualFiles`)
    const getVirtualFile = registered.get(`${RPC_NAMESPACE}:getVirtualFile`)
    expect(getVirtualFiles).toBeTypeOf('function')
    expect(getVirtualFile).toBeTypeOf('function')

    expect(getVirtualFiles!()).toEqual({
      rootDir: '/srv/proxied-app',
      entries: [
        {
          id: '#build/nuxt.config.mjs',
          path: '/srv/proxied-app/.nuxt/nuxt.config.mjs',
        },
      ],
    })
    await expect(getVirtualFile!('#build/nuxt.config.mjs')).resolves.toEqual({
      id: '#build/nuxt.config.mjs',
      content: 'export default { app: { baseURL: "/prefix/" } }',
    })
  })
})
