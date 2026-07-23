import { ref } from 'vue'

const STORAGE_KEY = 'nuxt-devtools-embedded'

/**
 * "Embedded" mode: the client app is loaded as a single, chromeless tab inside
 * a Vite DevTools dock iframe (via the `/embed/*` route). In this mode the app
 * shell — SideNav and split pane — is hidden so the iframe shows only the tab.
 *
 * The `/embed/*` entry route redirects to the real tab route right away, so the
 * URL no longer carries the `/embed/` marker afterwards. We persist the flag in
 * `sessionStorage` (isolated per iframe/browsing-context) so it survives that
 * redirect and any in-iframe reloads.
 */
function detect(): boolean {
  if (typeof window === 'undefined')
    return false
  try {
    if (window.sessionStorage.getItem(STORAGE_KEY) === '1')
      return true
  }
  catch {}
  // First paint lands on `/embed/*` before the redirect runs.
  return /\/embed(?:\/|$)/.test(window.location.pathname)
}

export const isEmbedded = ref(detect())

export function markEmbedded(): void {
  isEmbedded.value = true
  try {
    window.sessionStorage.setItem(STORAGE_KEY, '1')
  }
  catch {}
}
