import { parseUA } from 'ua-parser-modern'
import { ref } from 'vue'

/** @deprecated Auth is now handled by Vite DevTools */
export const devAuthToken = ref<string | null>('disabled')

/** @deprecated Auth is now handled by Vite DevTools */
export const isDevAuthed = ref(true)

/** @deprecated Auth is now handled by Vite DevTools */
export function updateDevAuthToken(_token: string) {
  console.warn('[nuxt-devtools] `updateDevAuthToken` is deprecated. Auth is now handled by Vite DevTools.')
}

/** @deprecated Auth is now handled by Vite DevTools */
export async function ensureDevAuthToken() {
  console.warn('[nuxt-devtools] `ensureDevAuthToken` is deprecated. Auth is now handled by Vite DevTools.')
  return ''
}

export const userAgentInfo = parseUA(navigator.userAgent)

/** @deprecated Auth is now handled by Vite DevTools */
export async function requestForAuth() {
  console.warn('[nuxt-devtools] `requestForAuth` is deprecated. Auth is now handled by Vite DevTools.')
}
