import type { Nuxt, NuxtConfig } from '@nuxt/schema'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { mkdtemp, rm } from 'node:fs/promises'
import { createServer } from 'node:http'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadNuxt } from 'nuxt'
import { afterEach, describe, expect, it } from 'vitest'

const onboardModule = fileURLToPath(new URL('../src/module.ts', import.meta.url))

const cleanups: (() => Promise<void>)[] = []
afterEach(async () => {
  await Promise.all(cleanups.splice(0).map(fn => fn()))
})

/**
 * Nuxt core pushes the bare `@nuxt/devtools` name into `_modules`; aliasing
 * it to this module reproduces what Nuxt 5 does with `@nuxt/devtools-onboard`.
 * `withoutDevtools` drops every `node_modules` Nuxt can resolve from, which is
 * the situation of a Nuxt that no longer depends on `@nuxt/devtools` itself.
 */
async function bootNuxt(overrides: NuxtConfig, { withoutDevtools = false } = {}): Promise<Nuxt> {
  const rootDir = await mkdtemp(join(tmpdir(), 'devtools-onboard-'))
  const nuxt = await loadNuxt({
    cwd: rootDir,
    ready: false,
    overrides: {
      alias: { '@nuxt/devtools': onboardModule },
      telemetry: false,
      ...overrides,
    },
  })
  cleanups.push(async () => {
    await nuxt.close()
    await rm(rootDir, { recursive: true, force: true })
  })
  if (withoutDevtools)
    nuxt.options.modulesDir = [join(rootDir, 'node_modules')]
  await nuxt.ready()
  return nuxt
}

function onboardScripts(nuxt: Nuxt) {
  return (nuxt.options.app.head.script ?? []).filter(script => typeof script === 'object' && script.src === '/__devtools/embedded.js')
}

type Middleware = (req: IncomingMessage, res: ServerResponse, next: () => void) => void

async function viteMiddlewareFetch(nuxt: Nuxt, path: string): Promise<Response> {
  const mounted: Middleware[] = []
  // Only `middlewares.use` is read; the rest of a real ViteDevServer is irrelevant here.
  const viteServer = { middlewares: { use: (fn: Middleware) => mounted.push(fn) } } as never
  await nuxt.callHook('vite:serverCreated', viteServer, { isClient: true, isServer: false })
  const [middleware] = mounted
  if (!middleware)
    throw new Error('onboarding middleware was not mounted')

  const server = createServer((req, res) => middleware(req, res, () => {
    res.statusCode = 404
    res.end()
  }))
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
  cleanups.push(() => new Promise(resolve => server.close(() => resolve())))
  const { port } = server.address() as { port: number } // listening on a TCP port, never a pipe
  return fetch(`http://127.0.0.1:${port}${path}`)
}

describe('@nuxt/devtools-onboard', () => {
  it('does nothing when devtools are disabled', async () => {
    const nuxt = await bootNuxt({ devtools: false, modules: [onboardModule] })
    expect(nuxt.options._requiredModules['@nuxt/devtools']).toBeUndefined()
    expect(onboardScripts(nuxt)).toHaveLength(0)
  }, 60_000)

  it('loads @nuxt/devtools when it is installed', async () => {
    const nuxt = await bootNuxt({})
    expect(nuxt.options._requiredModules['@nuxt/devtools']).toBe(true)
    expect(onboardScripts(nuxt)).toHaveLength(0)
  }, 60_000)

  it('offers to install @nuxt/devtools when it is missing', async () => {
    const nuxt = await bootNuxt({ dev: true }, { withoutDevtools: true })
    expect(nuxt.options._requiredModules['@nuxt/devtools']).toBeUndefined()
    expect(onboardScripts(nuxt)).toHaveLength(1)

    const status = await viteMiddlewareFetch(nuxt, '/__devtools/__onboard/status').then(r => r.json())
    expect(status.state).toBe('idle')
    // No lockfile in the fixture, so the package manager falls back to npm.
    expect(status.command.slice(0, 3)).toEqual(['npm', 'i', '-D'])
    expect(status.command[3]).toMatch(/^@nuxt\/devtools@\^4\./)
    expect(status.branding.productName).toBe('Nuxt DevTools')
  }, 60_000)

  it('stays out of the way outside nuxt dev when @nuxt/devtools is missing', async () => {
    const nuxt = await bootNuxt({ dev: false }, { withoutDevtools: true })
    expect(onboardScripts(nuxt)).toHaveLength(0)
  }, 60_000)
})
