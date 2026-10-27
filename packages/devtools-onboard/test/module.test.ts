import type { Nuxt, NuxtConfig } from '@nuxt/schema'
import type { ViteDevServer } from 'vite'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadNuxt } from 'nuxt'
import { createServer as createViteServer } from 'vite'
import { afterEach, describe, expect, it } from 'vitest'

const onboardModule = fileURLToPath(new URL('../src/module.ts', import.meta.url))

const cleanups: (() => Promise<void>)[] = []
afterEach(async () => {
  await Promise.all(cleanups.splice(0).map(fn => fn()))
})

/** A stand-in DevTools package whose module records its name in `appConfig`. */
async function installStandIn(rootDir: string, name: string) {
  const dir = join(rootDir, 'node_modules', name)
  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, 'package.json'), JSON.stringify({ name, type: 'module', exports: './module.mjs' }))
  await writeFile(join(dir, 'module.mjs'), `export default (_, nuxt) => { nuxt.options.appConfig.loadedDevtools = ${JSON.stringify(name)} }`)
}

/**
 * Nuxt core pushes the bare `@nuxt/devtools` name into `_modules`; aliasing
 * it to this module reproduces what Nuxt 5 does with `@nuxt/devtools-onboard`.
 * `withoutDevtools` drops every `node_modules` Nuxt can resolve from, which is
 * the situation of a Nuxt that no longer depends on `@nuxt/devtools` itself;
 * `installed` then puts stand-in packages back into the project.
 */
async function bootNuxt(overrides: NuxtConfig, { withoutDevtools = false, installed = [] }: { withoutDevtools?: boolean, installed?: string[] } = {}): Promise<Nuxt> {
  const rootDir = await mkdtemp(join(tmpdir(), 'devtools-onboard-'))
  await Promise.all(installed.map(name => installStandIn(rootDir, name)))
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
  if (withoutDevtools) {
    nuxt.options.modulesDir = [
      join(rootDir, 'node_modules'),
    ]
  }
  await nuxt.ready()
  return nuxt
}

function onboardScripts(nuxt: Nuxt) {
  return (nuxt.options.app.head.script ?? []).filter(script => typeof script === 'object' && script.src === '/__devtools/embedded.js')
}

/** Serves what the module mounts on a real client Vite server; resolves to its origin. */
async function serveViteMiddleware(nuxt: Nuxt): Promise<{ origin: string, viteServer: ViteDevServer }> {
  const viteServer = await createViteServer({
    configFile: false,
    logLevel: 'silent',
    server: { middlewareMode: true, ws: false },
  })
  cleanups.push(() => viteServer.close())
  // Mount only what the module adds, not Vite's own transform middlewares.
  viteServer.middlewares.stack.length = 0
  await nuxt.callHook('vite:serverCreated', viteServer, { isClient: true, isServer: false })

  const server = createServer(viteServer.middlewares)
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
  cleanups.push(() => new Promise(resolve => server.close(() => resolve())))
  const { port } = server.address() as { port: number } // listening on a TCP port, never a pipe
  return { origin: `http://127.0.0.1:${port}`, viteServer }
}

/** Nuxt's dev handler only passes a URL to Vite when a middleware is mounted on a path other than `/`. */
function nuxtRoutesToVite(viteServer: ViteDevServer, url: string) {
  return viteServer.middlewares.stack.some(({ route }) => route.length > 1 && url.startsWith(route))
}

const onboardStatus = (origin: string) => fetch(`${origin}/__devtools/__onboard/status`).then(r => r.json())

describe('@nuxt/devtools-onboard', () => {
  it('does nothing when devtools are disabled', async () => {
    const nuxt = await bootNuxt({
      devtools: false,
      modules: [onboardModule],
    })
    expect(nuxt.options._requiredModules['@nuxt/devtools']).toBeUndefined()
    expect(onboardScripts(nuxt)).toHaveLength(0)
  }, 60_000)

  it('loads @nuxt/devtools when it is installed', async () => {
    const nuxt = await bootNuxt({})
    expect(nuxt.options._requiredModules['@nuxt/devtools']).toBe(true)
    expect(onboardScripts(nuxt)).toHaveLength(0)
  }, 60_000)

  it('loads @nuxt/devtools-nightly installed under its own name, over @nuxt/devtools', async () => {
    const nuxt = await bootNuxt({ dev: true }, {
      withoutDevtools: true,
      installed: ['@nuxt/devtools', '@nuxt/devtools-nightly'],
    })
    expect(nuxt.options.appConfig.loadedDevtools).toBe('@nuxt/devtools-nightly')
    expect(onboardScripts(nuxt)).toHaveLength(0)
  }, 60_000)

  it('offers to install @nuxt/devtools when it is missing', async () => {
    const nuxt = await bootNuxt({ dev: true }, { withoutDevtools: true })
    expect(nuxt.options._requiredModules['@nuxt/devtools']).toBeUndefined()
    expect(onboardScripts(nuxt)).toHaveLength(1)

    const { origin, viteServer } = await serveViteMiddleware(nuxt)
    expect(nuxtRoutesToVite(viteServer, '/__devtools/embedded.js')).toBe(true)
    const script = await fetch(`${origin}/__devtools/embedded.js`)
    expect(script.headers.get('content-type')).toMatch(/javascript/)

    const status = await onboardStatus(origin)
    expect(status.state).toBe('idle')
    // No lockfile in the fixture, so the package manager falls back to npm.
    expect(status.command.slice(0, 3)).toEqual(['npm', 'i', '-D'])
    expect(status.command[3]).toMatch(/^@nuxt\/devtools@\^4\./)
    expect(status.branding.productName).toBe('Nuxt DevTools')
  }, 60_000)

  it('refuses to install when nobody can confirm it in the terminal', async () => {
    const nuxt = await bootNuxt({ dev: true }, { withoutDevtools: true })
    const { origin } = await serveViteMiddleware(nuxt)

    // Vitest workers get a piped stdin, so no terminal can answer the question.
    const install = await fetch(`${origin}/__devtools/__onboard/install`, { method: 'POST' })
    expect(install.status).toBe(403)
    expect((await onboardStatus(origin)).state).toBe('idle')
  }, 60_000)

  it('stays out of the way outside nuxt dev when @nuxt/devtools is missing', async () => {
    const nuxt = await bootNuxt({ dev: false }, { withoutDevtools: true })
    expect(onboardScripts(nuxt)).toHaveLength(0)
  }, 60_000)
})
