import { ref } from 'vue'

const STORAGE_KEY = 'nuxt-devtools-embedded'

/**
 * "Embedded" mode: the client is loaded as the shared-frame **anchor** inside a
 * Vite DevTools dock iframe (`?embed=1`). In this mode the app shell — SideNav
 * and split pane — is hidden so the iframe shows only the current tab, and the
 * `devframe:frame-nav` shim drives tab navigation from the dock instead.
 *
 * The flag is latched into `sessionStorage` (isolated per iframe) so it
 * survives soft navigation that drops the query and any reloads.
 */
function detect(): boolean {
  if (typeof window === 'undefined')
    return false
  try {
    if (window.sessionStorage.getItem(STORAGE_KEY) === '1')
      return true
  }
  catch {}
  const embedded = new URLSearchParams(window.location.search).get('embed') === '1'
  if (embedded) {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, '1')
    }
    catch {}
  }
  return embedded
}

export const isEmbedded = ref(detect())
