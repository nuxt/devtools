import type { StorageMounts } from 'nitropack'
import type { Storage, StorageValue } from 'unstorage'
import type { NuxtDevtoolsServerContext, ServerFunctions } from '../types'
import { watchStorageMount } from './storage-watch'

const IGNORE_STORAGE_MOUNTS = ['root', 'build', 'src', 'cache']
function shouldIgnoreStorageKey(key: string) {
  return IGNORE_STORAGE_MOUNTS.includes(key.split(':')[0]!)
}

export function setupStorageRPC({
  nuxt,
  rpc,
  ensureDevAuthToken,
}: NuxtDevtoolsServerContext) {
  const storageMounts: StorageMounts = {}

  let storage: Storage | undefined
  let unwatchStorageMounts: Array<() => Promise<void> | void> = []

  nuxt.hook('nitro:init', (nitro) => {
    storage = nitro.storage

    nuxt.hook('close', async () => {
      await Promise.all(unwatchStorageMounts.map(unwatch => unwatch()))
      unwatchStorageMounts = []
    })

    nuxt.hook('ready', async () => {
      const activeStorage = storage
      if (!activeStorage)
        return
      await Promise.all(unwatchStorageMounts.map(unwatch => unwatch()))
      unwatchStorageMounts = await Promise.all(Object.keys(storageMounts).map(mountName =>
        watchStorageMount(activeStorage, mountName, (event, key) => {
          if (shouldIgnoreStorageKey(key))
            return
          rpc.broadcast.callHook.asEvent('storage:key:update', key, event)
        })))
    })

    // Taken from https://github.com/unjs/nitro/blob/d83f2b65165d7ba996e7ef129ea99ff5b551dccc/src/storage.ts#L7-L10
    // Waiting for https://github.com/unjs/unstorage/issues/53
    const mounts = {
      ...nitro.options.storage,
      ...nitro.options.devStorage,
    }

    for (const name of Object.keys(mounts)) {
      if (shouldIgnoreStorageKey(name))
        continue
      storageMounts[name] = mounts[name]!
    }
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
    async getStorageItem(token: string, key: string) {
      await ensureDevAuthToken(token)
      if (!storage)
        return null
      return await storage.getItem(key)
    },
    async setStorageItem(token: string, key: string, value: StorageValue) {
      await ensureDevAuthToken(token)
      if (!storage)
        return
      return await storage.setItem(key, value)
    },
    async removeStorageItem(token: string, key: string) {
      await ensureDevAuthToken(token)
      if (!storage)
        return
      return await storage.removeItem(key)
    },
  } satisfies Partial<ServerFunctions>
}
