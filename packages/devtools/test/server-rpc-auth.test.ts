import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createHooks } from 'hookable'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setupGeneralRPC } from '../src/server-rpc/general'
import { setupOptionsRPC } from '../src/server-rpc/options'

const VALID_TOKEN = 'valid-token'

// Mutating RPC methods must gate on the dev auth token, exactly like the rest
// of the RPC surface (restartNuxt, storage writes, npm, terminals, ...). These
// tests assert the guard runs before any side effect.
function createAuthStub() {
  return vi.fn(async (token: string) => {
    if (token !== VALID_TOKEN)
      throw new Error('[Nuxt DevTools] Invalid dev auth token.')
  })
}

function createNuxtStub(rootDir: string) {
  const hooks = createHooks()
  return {
    hooks,
    hook: hooks.hook.bind(hooks),
    callHook: hooks.callHook.bind(hooks),
    options: { rootDir },
  } as any
}

describe('options rpc auth', () => {
  let rootDir: string

  beforeEach(async () => {
    rootDir = await mkdtemp(join(tmpdir(), 'nuxt-devtools-test-'))
    // sandbox where local options are persisted (see getHomeDir)
    process.env.XDG_CONFIG_HOME = rootDir
  })

  it('updateOptions rejects an invalid token', async () => {
    const ensureDevAuthToken = createAuthStub()
    const rpc = setupOptionsRPC({ nuxt: createNuxtStub(rootDir), ensureDevAuthToken } as any)

    await expect(rpc.updateOptions('invalid', 'behavior', { openInEditor: 'malicious' }))
      .rejects
      .toThrow(/invalid dev auth token/i)
    expect(ensureDevAuthToken).toHaveBeenCalledWith('invalid')
  })

  it('updateOptions proceeds with a valid token', async () => {
    const ensureDevAuthToken = createAuthStub()
    const rpc = setupOptionsRPC({ nuxt: createNuxtStub(rootDir), ensureDevAuthToken } as any)

    await expect(rpc.updateOptions(VALID_TOKEN, 'ui', { scale: 2 })).resolves.toBeUndefined()
    expect(ensureDevAuthToken).toHaveBeenCalledWith(VALID_TOKEN)
  })

  it('clearOptions rejects an invalid token', async () => {
    const ensureDevAuthToken = createAuthStub()
    const rpc = setupOptionsRPC({ nuxt: createNuxtStub(rootDir), ensureDevAuthToken } as any)

    await expect(rpc.clearOptions('invalid')).rejects.toThrow(/invalid dev auth token/i)
    expect(ensureDevAuthToken).toHaveBeenCalledWith('invalid')
  })
})

describe('general rpc auth', () => {
  function createGeneralRPC(ensureDevAuthToken: ReturnType<typeof createAuthStub>) {
    return setupGeneralRPC({
      nuxt: createNuxtStub(process.cwd()),
      options: {},
      refresh: vi.fn(),
      ensureDevAuthToken,
      openInEditorHooks: [],
    } as any)
  }

  it('openInEditor rejects an invalid token before touching the filesystem', async () => {
    const ensureDevAuthToken = createAuthStub()
    const general = createGeneralRPC(ensureDevAuthToken)

    await expect(general.openInEditor('invalid', './some-file.ts'))
      .rejects
      .toThrow(/invalid dev auth token/i)
    expect(ensureDevAuthToken).toHaveBeenCalledWith('invalid')
  })

  it('openInEditor proceeds past auth with a valid token', async () => {
    const ensureDevAuthToken = createAuthStub()
    const general = createGeneralRPC(ensureDevAuthToken)

    // A non-existent file resolves to `false` (never spawns an editor), which
    // proves the auth guard passed rather than short-circuiting with a throw.
    await expect(general.openInEditor(VALID_TOKEN, '/definitely/not/a/real/path-xyz'))
      .resolves
      .toBe(false)
    expect(ensureDevAuthToken).toHaveBeenCalledWith(VALID_TOKEN)
  })
})
