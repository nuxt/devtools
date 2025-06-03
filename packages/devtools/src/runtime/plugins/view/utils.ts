import type { Ref } from 'vue'
import { getCurrentScope, onScopeDispose, ref, watch } from 'vue'

export function useObjectStorage<T>(key: string, initial: T, listenToStorage = true): Ref<T> {
  const raw = localStorage.getItem(key)
  const data = ref(raw ? JSON.parse(raw) : initial)

  for (const key in initial) {
    if (data.value[key] === undefined)
      data.value[key] = initial[key]
  }

  let updating = false
  let wrote = ''

  watch(data, (value) => {
    if (updating)
      return
    wrote = JSON.stringify(value)
    localStorage.setItem(key, wrote)
  }, { deep: true, flush: 'post' })

  if (listenToStorage) {
    useEventListener(window, 'storage', (e: StorageEvent) => {
      if (e.key === key && e.newValue && e.newValue !== wrote) {
        updating = true
        data.value = JSON.parse(e.newValue)
        updating = false
      }
    })
  }

  return data
}

export function useEventListener(target: EventTarget, type: string, listener: any, options?: boolean | AddEventListenerOptions) {
  target.addEventListener(type, listener, options)
  if (getCurrentScope())
    onScopeDispose(() => target.removeEventListener(type, listener, options))
}
