import { ref } from 'vue'

const STORAGE_KEY = 'nuxt-devtools-embedded'

/**
 * "Embedded" mode: the client app is loaded as a single, chromeless tab inside
 * a Vite DevTools dock iframe (each per-tab dock entry points at the tab's own
 * route with an `?embed=1` flag). In this mode the app shell — SideNav and
 * split pane — is hidden so the iframe shows only the tab.
 *
 * The flag rides on the existing tab route (no dedicated route needed). We latch
 * it into `sessionStorage` — isolated per iframe/browsing-context — so it
 * survives in-iframe navigation that drops the query and any reloads.
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
