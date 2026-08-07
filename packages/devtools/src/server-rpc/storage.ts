import type { StorageBridgeWatchBatch } from '../runtime/nitro/storage-bridge'
import type { NuxtDevtoolsServerContext, ServerFunctions, StorageValue } from '../types'
import type { AnyNitro, AnyNitroConfig, AnyStorageMounts } from '../utils/nitro-compat'
import { join } from 'pathe'
import { getDevAuthToken } from '../dev-auth'
import { runtimeDir } from '../dirs'
import { DEVTOOLS_STORAGE_ROUTE } from '../runtime/nitro/storage-bridge'

const IGNORE_STORAGE_MOUNTS = ['root', 'build', 'src', 'cache', 'assets']
function shouldIgnoreStorageKey(key: string) {
  return IGNORE_STORAGE_MOUNTS.includes(key.split(':')[0]!)
}

const WATCH_POLL_INTERVAL = 1000

export function setupStorageRPC(ctx: NuxtDevtoolsServerContext) {
  const { nuxt } = ctx
  const storageMounts: AnyStorageMounts = {}

  let bridgeAvailable = false

  nuxt.hook('nitro:config', async (config: AnyNitroConfig) => {
    if (!nuxt.options.dev)
      return
    config.virtual = config.virtual || {}
    config.virtual['#nuxt-devtools-storage'] = `export const token = ${JSON.stringify(await getDevAuthToken())}`
  })

  nuxt.hook('nitro:init', (nitro: AnyNitro) => {
    // Taken from https://github.com/unjs/nitro/blob/d83f2b65165d7ba996e7ef129ea99ff5b551dccc/src/storage.ts#L7-L10
    // Waiting for https://github.com/unjs/unstorage/issues/53
    const mounts: AnyStorageMounts = {
      ...nitro.options.storage,
      ...nitro.options.devStorage,
    }

    for (const key of Object.keys(storageMounts))
      delete storageMounts[key]

    for (const name of Object.keys(mounts)) {
      if (shouldIgnoreStorageKey(name))
        continue
      storageMounts[name] = mounts[name]!
    }

    if (!nuxt.options.dev)
      return

    // Neither engine hands the orchestrating process the storage instance the
    // server actually uses: Nitro v3 dropped the `nitro.storage` runtime
    // property entirely, and even on Nitro v2 it is a separate build-process
    // instance, not the one `useStorage()` returns inside the server. Instead
    // of duplicating mounts (and their fs watchers) in this process, register
    // a dev-only handler inside the running server that proxies storage
    // operations to the real runtime instance — this also makes in-memory
    // mounts reflect the live server state. `nitro.meta.majorVersion` tells us
    // which engine (and therefore which runtime import) the handler needs;
    // older nitropack v2 releases predate `meta`, hence the fallback.
    const engine = ((nitro as { meta?: { majorVersion?: number } }).meta?.majorVersion ?? 2) >= 3 ? 'v3' : 'v2'
    ;(nitro.options.handlers as Array<{ route: string, handler: string }>).push({
      route: DEVTOOLS_STORAGE_ROUTE,
      handler: join(runtimeDir, `nitro/storage-handler-${engine}`),
    })
    bridgeAvailable = true
  })

  async function callBridge<T>(method: string, args: unknown[]): Promise<T> {
    const url = new URL(DEVTOOLS_STORAGE_ROUTE, nuxt.options.devServer.url)
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ token: await getDevAuthToken(), method, args }),
    })
    if (!res.ok)
      throw new Error(`Storage bridge request "${method}" failed: ${res.status} ${res.statusText}`)
    const data = await res.json() as { result: T }
    return data.result
  }

  let watchInstance: string | undefined
  let watchCursor = 0
  let pollTimer: NodeJS.Timeout | undefined
  let polling = false

  async function pollWatchEvents() {
    if (polling)
      return
    polling = true
    try {
      const batch = await callBridge<StorageBridgeWatchBatch>('pullWatchEvents', [watchInstance, watchCursor])
      const isSameInstance = watchInstance === batch.instance
      watchInstance = batch.instance
      watchCursor = batch.cursor
      if (!isSameInstance)
        return
      for (const { event, key } of batch.events) {
        if (shouldIgnoreStorageKey(key))
          continue
        ctx.devtoolsKit?.rpc.broadcast({ method: 'callHook', args: ['storage:key:update', key, event], event: true } as any)
      }
    }
    catch {
      // Dev server not listening yet, or restarting — retry on the next tick.
    }
    finally {
      polling = false
    }
  }

  nuxt.hook('ready', () => {
    if (!bridgeAvailable || pollTimer)
      return
    pollTimer = setInterval(pollWatchEvents, WATCH_POLL_INTERVAL)
  })

  nuxt.hook('close', () => {
    if (pollTimer) {
      clearInterval(pollTimer)
      pollTimer = undefined
    }
  })

  return {
    async getStorageMounts() {
      return storageMounts
    },
    async getStorageKeys(base?: string) {
      if (!bridgeAvailable)
        return []
      try {
        const keys = await callBridge<string[]>('getKeys', [base])
        return keys.filter(key => !shouldIgnoreStorageKey(key))
      }
      catch (err) {
        console.error(`Could not fetch storage keys for ${base}:`, err)
        return []
      }
    },
    async getStorageItem(key: string) {
      if (!bridgeAvailable)
        return null
      return await callBridge<StorageValue>('getItem', [key])
    },
    async setStorageItem(key: string, value: StorageValue) {
      if (!bridgeAvailable)
        return
      return await callBridge<void>('setItem', [key, value])
    },
    async removeStorageItem(key: string) {
      if (!bridgeAvailable)
        return
      return await callBridge<void>('removeItem', [key])
    },
  } satisfies Partial<ServerFunctions>
}
