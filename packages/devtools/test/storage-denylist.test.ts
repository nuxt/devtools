import type { NuxtDevtoolsServerContext } from '../src/types'
import fsp from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createHooks } from 'hookable'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { setupStorageRPC } from '../src/server-rpc/storage'

let root: string
let projectDir: string
let rpc: ReturnType<typeof setupStorageRPC>

// `root` is an fs mount over a stand-in project dir, like Nitro's dev `root`
// mount; `db` is an ordinary user mount.
beforeEach(async () => {
  root = await fsp.mkdtemp(join(tmpdir(), 'nuxt-devtools-storage-'))
  projectDir = join(root, 'project')
  await fsp.mkdir(projectDir)
  await fsp.writeFile(join(projectDir, 'nuxt.config.ts'), 'original')

  const hooks = createHooks()
  rpc = setupStorageRPC({ nuxt: { hook: hooks.hook.bind(hooks) } } as unknown as NuxtDevtoolsServerContext)
  await hooks.callHook('nitro:init', {
    options: {
      storage: {
        root: { driver: 'fs', base: projectDir },
        db: { driver: 'fs', base: join(root, 'db') },
      },
    },
    logger: { warn: () => {} },
  })
})

afterEach(() => fsp.rm(root, { recursive: true, force: true }))

const readProjectConfig = () => fsp.readFile(join(projectDir, 'nuxt.config.ts'), 'utf-8')

describe('storage mount denylist', () => {
  // Every spelling unstorage routes to the `root` mount.
  const deniedKeys = ['root:nuxt.config.ts', '/root:nuxt.config.ts', ':root:nuxt.config.ts', 'root/nuxt.config.ts', '\\root\\nuxt.config.ts']

  it.each(deniedKeys)('refuses to read, write or remove %s', async (key) => {
    expect(await rpc.getStorageItem(key)).toBeNull()

    await rpc.setStorageItem(key, 'overwritten')
    expect(await readProjectConfig()).toBe('original')

    await rpc.removeStorageItem(key)
    expect(await readProjectConfig()).toBe('original')
  })

  it('lists and serves user mounts only', async () => {
    await rpc.setStorageItem('db:users', 'alice')

    expect(await rpc.getStorageItem('db:users')).toBe('alice')
    expect(await rpc.getStorageKeys()).toEqual(['db:users'])
    expect(Object.keys(await rpc.getStorageMounts())).toEqual(['db'])

    await rpc.removeStorageItem('db:users')
    expect(await rpc.getStorageKeys()).toEqual([])
  })
})
