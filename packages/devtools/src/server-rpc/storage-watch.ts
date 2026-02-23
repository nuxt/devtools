import type { Storage, WatchCallback, WatchEvent } from 'unstorage'
import { normalizeBaseKey, normalizeKey } from 'unstorage'

export type UnwatchStorageMount = () => Promise<void> | void

export async function watchStorageMount(storage: Storage, mountName: string, onChange: WatchCallback): Promise<UnwatchStorageMount> {
  const mountKey = normalizeBaseKey(mountName)
  const mount = storage.getMounts().find(item => item.base === mountKey)
  const watch = mount?.driver.watch

  if (!watch)
    return () => {}

  return await watch((event: WatchEvent, key: string) => {
    onChange(event, normalizeKey(`${mountKey}${key}`))
  })
}
