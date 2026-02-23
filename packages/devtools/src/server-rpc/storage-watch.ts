import type { Storage } from 'unstorage'
import { normalizeBaseKey, normalizeKey } from 'unstorage'

export type UnwatchStorageMount = () => Promise<void> | void
type WatchEvent = 'update' | 'remove'
type WatchCallback = (event: WatchEvent, key: string) => void

export async function watchStorageMount(storage: Storage, mountName: string, onChange: WatchCallback): Promise<UnwatchStorageMount> {
  const mountKey = normalizeBaseKey(mountName)
  const unwatch = await storage.watch((event: WatchEvent, key: string) => {
    if (!key.startsWith(mountKey))
      return
    onChange(event, normalizeKey(key))
  })
  return unwatch ?? (() => {})
}
