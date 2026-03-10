import type { Plugin } from 'vite'
import { describe, expect, it, vi } from 'vitest'
import * as bridge from './vite-devtools'

describe('vite-devtools integration helpers', () => {
  it('resolves base route with normalized slashes', () => {
    expect(bridge.resolveNuxtDevToolsBaseRoute('/')).toBe('/__nuxt_devtools__')
    expect(bridge.resolveNuxtDevToolsBaseRoute('/foo/')).toBe('/foo/__nuxt_devtools__')
    expect(bridge.resolveNuxtDevToolsBaseRoute('foo')).toBe('foo/__nuxt_devtools__')
  })

  it('resolves client route with trailing slash', () => {
    expect(bridge.resolveNuxtDevToolsClientRoute('/')).toBe('/__nuxt_devtools__/client/')
    expect(bridge.resolveNuxtDevToolsClientRoute('/foo/')).toBe('/foo/__nuxt_devtools__/client/')
  })

  it('throws importer errors', async () => {
    await expect(bridge.loadViteDevToolsPlugins(async () => {
      throw new Error('boom')
    })).rejects.toThrow('boom')
  })

  it('loads plugins when importer resolves', async () => {
    const plugin = { name: 'mock-devtools-plugin' } as Plugin
    const plugins = await bridge.loadViteDevToolsPlugins(async () => ({
      DevTools: async () => [plugin],
    }))
    expect(plugins).toEqual([plugin])
  })

  it('creates a bridge plugin with base-aware dock url and captures context', async () => {
    const existingPlugin = { name: 'existing-devtools-plugin' } as Plugin
    const loadSpy = vi.spyOn(bridge, 'loadViteDevToolsPlugins').mockResolvedValue([existingPlugin])

    const result = await bridge.setupViteDevToolsBridge({
      options: {
        app: {
          baseURL: '/foo/',
        },
      },
    } as any)

    loadSpy.mockRestore()
    expect(result.state.dockUrl).toBe('/foo/__nuxt_devtools__/client/')

    const register = vi.fn()
    const context = { docks: { register } }
    result.plugins.at(-1)!.devtools!.setup(context as any)

    expect(register).toHaveBeenCalledWith(expect.objectContaining({
      id: bridge.NUXT_DOCK_ID,
      type: 'iframe',
      url: '/foo/__nuxt_devtools__/client/',
    }))
    expect(result.state.context).toBe(context)
  })
})
