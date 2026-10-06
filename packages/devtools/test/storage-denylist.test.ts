import type { NuxtDevtoolsServerContext } from '../src/types'
import { createHooks } from 'hookable'
import { describe, expect, it } from 'vitest'
import { setupStorageRPC } from '../src/server-rpc/storage'

async function storageRpcWithMounts(mounts: string[]) {
  const hooks = createHooks()
  const nuxt = { hook: hooks.hook.bind(hooks), callHook: hooks.callHook.bind(hooks) }
  const rpc = setupStorageRPC({ nuxt } as unknown as NuxtDevtoolsServerContext)
  await hooks.callHook('nitro:init', {
    options: { storage: Object.fromEntries(mounts.map(name => [name, { driver: 'memory' }])) },
    logger: { warn: () => {} },
  })
  return rpc
}

describe('storage mount denylist', () => {
  it('hides project-backed mounts from listing and from every item operation', async () => {
    const rpc = await storageRpcWithMounts(['root', 'src', 'db'])

    await rpc.setStorageItem('root:nuxt.config.ts', 'overwritten')
    await rpc.setStorageItem('src:app.vue', 'overwritten')
    await rpc.setStorageItem('db:users', ['alice'])

    expect(await rpc.getStorageItem('root:nuxt.config.ts')).toBeNull()
    expect(await rpc.getStorageItem('src:app.vue')).toBeNull()
    expect(await rpc.getStorageItem('db:users')).toEqual(['alice'])
    expect(await rpc.getStorageKeys()).toEqual(['db:users'])
    expect(Object.keys(await rpc.getStorageMounts())).toEqual(['db'])

    await rpc.removeStorageItem('db:users')
    expect(await rpc.getStorageKeys()).toEqual([])
  })
})
