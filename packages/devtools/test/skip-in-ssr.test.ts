import type { ViteDevToolsNodeContext } from '@vitejs/devtools-kit'
import { describe, expect, it } from 'vitest'
import { skipInSSR } from '../src/server-rpc/skip-in-ssr'

function fakeCtx(viteConfig: Partial<ViteDevToolsNodeContext['viteConfig']> | undefined): Pick<ViteDevToolsNodeContext, 'viteConfig'> {
  return { viteConfig } as Pick<ViteDevToolsNodeContext, 'viteConfig'>
}

describe('skipInSSR', () => {
  it('skips a truthy build.ssr, regardless of command', () => {
    expect(skipInSSR(fakeCtx({ command: 'build', build: { ssr: true } as any }))).toBe(true)
    expect(skipInSSR(fakeCtx({ command: 'serve', build: { ssr: true } as any }))).toBe(true)
  })

  it('does not skip a falsy build.ssr', () => {
    expect(skipInSSR(fakeCtx({ command: 'serve', build: { ssr: false } as any }))).toBe(false)
    expect(skipInSSR(fakeCtx({ command: 'serve', build: {} as any }))).toBe(false)
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
    expect(skipInSSR(bothEnvsSsr)).toBe(true)
    expect(skipInSSR(bothEnvsClient)).toBe(false)
  })

  it('does not skip a missing config', () => {
    expect(skipInSSR(undefined)).toBe(false)
    expect(skipInSSR(fakeCtx(undefined))).toBe(false)
  })
})
