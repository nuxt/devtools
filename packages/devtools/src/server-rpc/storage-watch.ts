import type { Storage } from 'unstorage'
import { normalizeBaseKey, normalizeKey } from 'unstorage'

export type UnwatchStorageMount = () => Promise<void> | void
type WatchEvent = 'update' | 'remove'
type WatchCallback = (event: WatchEvent, key: string) => void

export async function watchStorageMount(storage: Storage, mountName: string, onChange: WatchCallback): Promise<UnwatchStorageMount> {
  const mountKey = normalizeBaseKey(mountName)
  const mount = storage.getMount(mountKey)
  if (!mount || normalizeBaseKey(mount.base) !== mountKey || !mount.driver?.watch)
    return () => {}

  const unwatch = await mount.driver.watch((event: WatchEvent, key: string) => {
    const fullKey = key.startsWith(mountKey) ? key : `${mountKey}${key}`
    onChange(event, normalizeKey(fullKey))
  })
  return unwatch ?? (() => {})
}
