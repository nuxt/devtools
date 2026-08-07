export const DEVTOOLS_STORAGE_ROUTE = '/__nuxt_devtools__/storage'

/**
 * Mounts Nitro adds for its own bookkeeping.
 */
export const IGNORE_STORAGE_MOUNTS = ['root', 'build', 'src', 'cache', 'assets']

export function shouldIgnoreStorageKey(key: string) {
  return IGNORE_STORAGE_MOUNTS.includes(key.split(':')[0]!)
}

export type StorageBridgeMethod = 'getKeys' | 'getItem' | 'setItem' | 'removeItem' | 'pullWatchEvents'

export interface StorageBridgeRequest {
  token: string
  method: StorageBridgeMethod
  args?: unknown[]
}

export interface StorageBridgeWatchEvent {
  event: 'update' | 'remove'
  key: string
}

export interface StorageBridgeWatchBatch {
  instance: string
  cursor: number
  events: StorageBridgeWatchEvent[]
}

/**
 * Structural subset of unstorage's `Storage` shared by the v1 instance Nitro v2
 * bundles and the v2 instance Nitro v3 bundles, so the bridge works against
 * whichever `useStorage()` returns without importing either version.
 */
export interface StorageBridgeStorage {
  getKeys: (base?: string) => Promise<string[]>
  getItem: (key: string) => Promise<unknown>
  setItem: (key: string, value: any) => Promise<void>
  removeItem: (key: string) => Promise<void>
  getMounts?: () => Array<{
    base: string
    driver: {
      watch?: (callback: (event: 'update' | 'remove', key: string) => void) => Promise<unknown> | unknown
    }
  }>
}

const MAX_BUFFERED_EVENTS = 500

interface WatchState {
  instance: string
  events: Array<StorageBridgeWatchEvent & { id: number }>
  nextId: number
}

let watchState: WatchState | undefined

async function ensureWatcher(storage: StorageBridgeStorage): Promise<WatchState> {
  if (watchState)
    return watchState
  const state: WatchState = {
    instance: Math.random().toString(36).slice(2),
    events: [],
    nextId: 1,
  }
  watchState = state

  const mounts = storage.getMounts?.() ?? []
  await Promise.all(mounts.map(async ({ base, driver }) => {
    if (!driver?.watch || shouldIgnoreStorageKey(base))
      return
    try {
      await driver.watch((event, key) => {
        state.events.push({ id: state.nextId++, event, key: base + key })
        if (state.events.length > MAX_BUFFERED_EVENTS)
          state.events.splice(0, state.events.length - MAX_BUFFERED_EVENTS)
      })
    }
    catch {
      // Some drivers don't support watching; polling clients see no events for them.
    }
  }))

  return state
}

export async function handleStorageBridgeRequest(storage: StorageBridgeStorage, body: StorageBridgeRequest | undefined, token: string) {
  if (!token || !body || body.token !== token)
    throw new Error('[nuxt-devtools] Invalid storage bridge token')

  const args = body.args ?? []
  switch (body.method) {
    case 'getKeys':
      return { result: await storage.getKeys(args[0] as string | undefined) }
    case 'getItem':
      return { result: await storage.getItem(args[0] as string) }
    case 'setItem':
      return { result: await storage.setItem(args[0] as string, args[1]) }
    case 'removeItem':
      return { result: await storage.removeItem(args[0] as string) }
    case 'pullWatchEvents': {
      const state = await ensureWatcher(storage)
      const [instance, cursor] = args as [string | undefined, number | undefined]
      const events = instance === state.instance
        ? state.events.filter(e => e.id > (cursor ?? 0))
        : []
      const batch: StorageBridgeWatchBatch = {
        instance: state.instance,
        cursor: state.events.at(-1)?.id ?? 0,
        events: events.map(({ event, key }) => ({ event, key })),
      }
      return { result: batch }
    }
    default:
      throw new Error(`[nuxt-devtools] Unknown storage bridge method "${(body as StorageBridgeRequest).method}"`)
  }
}
