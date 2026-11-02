import type { IncomingMessage } from 'node:http'
import type { Nuxt } from 'nuxt/schema'
import type { ViteDevServer } from 'vite'
import { Buffer } from 'node:buffer'
import { createServer as createHttpServer } from 'node:http'
import { createServer as createHttpsServer } from 'node:https'
import { describe, expect, it, vi } from 'vitest'
import { createDevListenerPlugin } from '../src/utils/dev-listener'

function setup(options: { listener?: unknown, ssr?: boolean, httpServer?: unknown } = {}) {
  const upgrade = vi.fn()
  const nuxt = {
    _devServerListener: 'listener' in options
      ? options.listener
      : createHttpsServer(),
    server: { upgrade },
  } as unknown as Nuxt
  const server = {
    httpServer: options.httpServer ?? null,
    config: {
      build: { ssr: options.ssr },
    },
  } as unknown as ViteDevServer

  const hook = createDevListenerPlugin(nuxt).configureServer as { order: string, handler: (server: ViteDevServer) => void }
  expect(hook.order).toBe('pre')
  hook.handler(server)

  const forward = (url: string) => nuxt.server.upgrade({ url } as IncomingMessage, {} as any, Buffer.alloc(0))
  return { nuxt, server, upgrade, forward }
}

describe('createDevListenerPlugin', () => {
  it('hands an HTTPS listener to the client Vite server', () => {
    const { nuxt, server } = setup()
    expect(server.httpServer).toBe(nuxt._devServerListener)
  })

  it('keeps Nitro off DevTools upgrades only', () => {
    const { forward, upgrade } = setup()
    forward('/__devtools/__ws')
    expect(upgrade).not.toHaveBeenCalled()
    forward('/_ws')
    expect(upgrade).toHaveBeenCalledOnce()
  })

  it('wraps the Nitro upgrade handler once across Vite restarts', () => {
    const { nuxt, forward, upgrade } = setup()
    const wrapped = nuxt.server.upgrade
    const hook = createDevListenerPlugin(nuxt).configureServer as { handler: (server: ViteDevServer) => void }
    hook.handler({
      httpServer: null,
      config: { build: {} },
    } as unknown as ViteDevServer)
    expect(nuxt.server.upgrade).toBe(wrapped)
    forward('/_ws')
    expect(upgrade).toHaveBeenCalledOnce()
  })

  it('leaves plain-HTTP listeners on the side-car', () => {
    const { server, nuxt, upgrade } = setup({
      listener: createHttpServer(),
    })
    expect(server.httpServer).toBeNull()
    expect(nuxt.server.upgrade).toBe(upgrade)
  })

  it('leaves the SSR server, an existing httpServer, and a missing listener alone', () => {
    expect(setup({ ssr: true }).server.httpServer).toBeNull()
    const existing = createHttpsServer()
    expect(setup({ httpServer: existing }).server.httpServer).toBe(existing)
    expect(setup({ listener: undefined }).server.httpServer).toBeNull()
  })
})
