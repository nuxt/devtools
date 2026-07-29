import type { Storage, StorageValue } from 'unstorage'
import type { NuxtDevtoolsServerContext, ServerFunctions } from '../types'
import type { AnyNitro, AnyStorageMounts } from '../utils/nitro-compat'
import { builtinDrivers, createStorage } from 'unstorage'
import { watchStorageMount } from './storage-watch'

const IGNORE_STORAGE_MOUNTS = ['root', 'build', 'src', 'cache']
function shouldIgnoreStorageKey(key: string) {
  return IGNORE_STORAGE_MOUNTS.includes(key.split(':')[0]!)
}

export function setupStorageRPC(ctx: NuxtDevtoolsServerContext) {
  const { nuxt } = ctx
  const storageMounts: AnyStorageMounts = {}

  let storage: Storage | undefined
  let unwatchStorageMounts: Array<() => Promise<void> | void> = []

  nuxt.hook('nitro:init', async (nitro: AnyNitro) => {
    // Taken from https://github.com/unjs/nitro/blob/d83f2b65165d7ba996e7ef129ea99ff5b551dccc/src/storage.ts#L7-L10
    // Waiting for https://github.com/unjs/unstorage/issues/53
    const mounts: AnyStorageMounts = {
      ...nitro.options.storage,
      ...nitro.options.devStorage,
    }

    // Nitro v3 dropped the `nitro.storage` runtime instance that Nitro v2
    // (`nitropack`) exposed directly on the Nitro object — storage is now a
    // build-time virtual module consumed via `useStorage()` from *inside* the
    // built server, not reachable from this orchestrating process. Build our
    // own `unstorage` instance from the same mount config instead, mirroring
    // what nitropack's own `createStorage()` helper does. This works
    // identically on Nitro v2 and v3, though it is a distinct instance from
    // whichever one the running server uses — in-memory-driver mounts (e.g.
    // the default cache) won't reflect the live server's in-process state,
    // only mounts backed by external state (filesystem, redis, ...) will.
    const nextStorage = createStorage()
    for (const [path, opts] of Object.entries(mounts)) {
      if (!opts?.driver) {
        nitro.logger.warn(`No \`driver\` set for storage mount point "${path}".`)
        continue
      }
      try {
        const driverImport = builtinDrivers[opts.driver as keyof typeof builtinDrivers] || opts.driver
        const driverFactory = await import(driverImport).then(r => r.default || r)
        nextStorage.mount(path, driverFactory(opts))
      }
      catch (err) {
        nitro.logger.warn(`Failed to mount storage driver "${opts.driver}" for the DevTools storage browser:`, err)
      }
    }
    storage = nextStorage

    for (const key of Object.keys(storageMounts))
      delete storageMounts[key]

    for (const name of Object.keys(mounts)) {
      if (shouldIgnoreStorageKey(name))
        continue
      storageMounts[name] = mounts[name]!
    }
  })

  nuxt.hook('ready', async () => {
    const activeStorage = storage
    if (!activeStorage)
      return
    await Promise.all(unwatchStorageMounts.map(unwatch => unwatch()))
    unwatchStorageMounts = await Promise.all(Object.keys(storageMounts).map(mountName =>
      watchStorageMount(activeStorage, mountName, (event, key) => {
        ctx.devtoolsKit?.rpc.broadcast({ method: 'callHook', args: ['storage:key:update', key, event], event: true } as any)
      })))
  })

  nuxt.hook('close', async () => {
    await Promise.all(unwatchStorageMounts.map(unwatch => unwatch()))
    unwatchStorageMounts = []
  })

  return {
    async getStorageMounts() {
      return storageMounts
    },
    async getStorageKeys(base?: string) {
      if (!storage)
        return []
      try {
        const keys = await storage.getKeys(base)

        return keys.filter(key => !shouldIgnoreStorageKey(key))
      }
      catch (err) {
        console.error(`Cloud not fetch storage keys for ${base}:`, err)
        return []
      }
    },
    async getStorageItem(key: string) {
      if (!storage)
        return null
      return await storage.getItem(key)
    },
    async setStorageItem(key: string, value: StorageValue) {
      if (!storage)
        return
      return await storage.setItem(key, value)
    },
    async removeStorageItem(key: string) {
      if (!storage)
        return
      return await storage.removeItem(key)
    },
  } satisfies Partial<ServerFunctions>
}
