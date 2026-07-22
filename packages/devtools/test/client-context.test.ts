import type { ViteDevToolsNodeContext } from '@vitejs/devtools-kit'
import { describe, expect, it } from 'vitest'
import { classifyViteDevToolsContext } from '../src/server-rpc/client-context'

function fakeCtx(viteConfig: Partial<ViteDevToolsNodeContext['viteConfig']> | undefined): Pick<ViteDevToolsNodeContext, 'viteConfig'> {
  return { viteConfig } as Pick<ViteDevToolsNodeContext, 'viteConfig'>
}

describe('classifyViteDevToolsContext', () => {
  it('classifies a truthy build.ssr as ssr, regardless of command', () => {
    expect(classifyViteDevToolsContext(fakeCtx({ command: 'build', build: { ssr: true } as any }))).toBe('ssr')
    expect(classifyViteDevToolsContext(fakeCtx({ command: 'serve', build: { ssr: true } as any }))).toBe('ssr')
  })

  it('classifies command "serve" with a falsy build.ssr as client', () => {
    expect(classifyViteDevToolsContext(fakeCtx({ command: 'serve', build: { ssr: false } as any }))).toBe('client')
    expect(classifyViteDevToolsContext(fakeCtx({ command: 'serve', build: {} as any }))).toBe('client')
  })

  it('does not classify from environment names', () => {
    // Vite 8 exposes `client` and `ssr` environment names on both the
    // Nuxt client and SSR resolved configs, so they must not be consulted.
    const bothEnvsSsr = fakeCtx({
      command: 'build',
      build: { ssr: true } as any,
      environments: { client: {}, ssr: {} } as any,
    })
    const bothEnvsClient = fakeCtx({
      command: 'serve',
      build: {} as any,
      environments: { client: {}, ssr: {} } as any,
    })
    expect(classifyViteDevToolsContext(bothEnvsSsr)).toBe('ssr')
    expect(classifyViteDevToolsContext(bothEnvsClient)).toBe('client')
  })

  it('classifies a missing config as unknown', () => {
    expect(classifyViteDevToolsContext(undefined)).toBe('unknown')
    expect(classifyViteDevToolsContext(fakeCtx(undefined))).toBe('unknown')
  })

  it('classifies command "build" with a falsy build.ssr as unknown', () => {
    expect(classifyViteDevToolsContext(fakeCtx({ command: 'build', build: {} as any }))).toBe('unknown')
  })
})
