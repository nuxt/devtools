import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { runWithNuxtContext } from '@nuxt/kit'
import { createHooks } from 'hookable'
import { beforeAll, describe, expect, it } from 'vitest'
import { defaultOptions } from '../src/constant'
import { getDevAuthToken } from '../src/dev-auth'
import { setupRPC } from '../src/server-rpc'

const SECRET = 'synthetic-secret'

// Exercise the composed RPC table the HMR socket dispatches to, so a later
// module re-registering a method without the token guard is caught.
async function setupServer() {
  const hooks = createHooks()
  const rootDir = await mkdtemp(join(tmpdir(), 'nuxt-devtools-test-'))
  const nuxt = {
    hooks,
    hook: hooks.hook.bind(hooks),
    callHook: hooks.callHook.bind(hooks),
    options: {
      rootDir,
      srcDir: rootDir,
      dir: { public: 'public' },
      app: { baseURL: '/' },
      runtimeConfig: { secret: SECRET, public: {} },
      nitro: { runtimeConfig: { secret: SECRET } },
      _layers: [{ config: { runtimeConfig: { secret: SECRET } } }],
    },
  } as any
  const { rpc } = runWithNuxtContext(nuxt, () => setupRPC(nuxt, defaultOptions))
  await nuxt.callHook('nitro:init', {
    storage: {},
    options: { storage: { db: { driver: 'redis', password: SECRET } }, devStorage: {} },
  })
  return { nuxt, functions: rpc.functions }
}

describe('private server data rpc', () => {
  let server: Awaited<ReturnType<typeof setupServer>>

  beforeAll(async () => {
    // sandbox where the dev auth token is persisted (see getHomeDir)
    process.env.XDG_CONFIG_HOME = await mkdtemp(join(tmpdir(), 'nuxt-devtools-home-'))
    server = await setupServer()
  })

  it('getServerConfig rejects a missing or invalid token', async () => {
    // @ts-expect-error simulating a tokenless client
    await expect(server.functions.getServerConfig()).rejects.toThrow(/invalid dev auth token/i)
    await expect(server.functions.getServerConfig('invalid')).rejects.toThrow(/invalid dev auth token/i)
  })

  it('getServerConfig returns the options with a valid token', async () => {
    await expect(server.functions.getServerConfig(await getDevAuthToken())).resolves.toBe(server.nuxt.options)
  })

  it('getStorageMounts and getStorageKeys reject an invalid token', async () => {
    await expect(server.functions.getStorageMounts('invalid')).rejects.toThrow(/invalid dev auth token/i)
    await expect(server.functions.getStorageKeys('invalid', 'db')).rejects.toThrow(/invalid dev auth token/i)
  })

  it('getStorageMounts returns mounts with a valid token', async () => {
    await expect(server.functions.getStorageMounts(await getDevAuthToken()))
      .resolves
      .toEqual({ db: { driver: 'redis', password: SECRET } })
  })
})
