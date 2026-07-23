import type { ModuleBuiltinTab, ModuleCustomTab } from '~/../src/types'
import { watch } from 'vue'
import { useRouter } from '#app/composables/router'
import { useAllTabs } from '~/composables/state-tabs'

// `devframe:frame-nav` — the embedded-app half of the shared-iframe soft-nav
// protocol (devframe#128 / vitejs/devtools#464). The Vite DevTools dock owns
// one kept-alive iframe (the anchor); this shim announces one member dock per
// DevTools tab and switches views by client-side navigation, so no per-tab
// iframe/reload is needed. The shim is transport-only: it takes no hub/RPC
// dependency, just `postMessage`.
const CHANNEL = 'devframe:frame-nav'
const VERSION = 1
// Must match the anchor's `frameId` registered in `module-main.ts`.
const FRAME_ID = 'nuxt:devtools'

const ICON_CLASS_RE = /\s.*$/
const FIRST_DASH_RE = /-/

/** Normalise a tab icon (UnoCSS `i-carbon-foo` / `carbon-foo`) to iconify `carbon:foo`. */
function normalizeIcon(icon: string | undefined): string | undefined {
  if (!icon)
    return undefined
  let token = icon.replace(ICON_CLASS_RE, '')
  if (/^(?:https?:)?\/\//.test(token) || token.startsWith('/') || token.startsWith('data:'))
    return token
  if (token.startsWith('i-'))
    token = token.slice(2)
  if (!token.includes(':'))
    token = token.replace(FIRST_DASH_RE, ':')
  return token
}

function tabPath(tab: ModuleBuiltinTab | ModuleCustomTab): string {
  return 'path' in tab && tab.path ? tab.path : `/modules/custom-${tab.name}`
}

/**
 * Start the frame-nav shim. No-op unless running inside an iframe. Announces the
 * tab manifest, answers `navigate` with client-side navigation, and reports
 * `navigated` so the dock highlight follows in-app navigation.
 */
export function setupFrameNav(): void {
  if (typeof window === 'undefined' || window.parent === window)
    return

  const router = useRouter()
  const tabs = useAllTabs()

  function buildManifest() {
    return tabs.value.map(tab => ({
      id: tab.name,
      title: tab.title ?? tab.name,
      icon: normalizeIcon(tab.icon),
      category: tab.category,
      navTarget: { path: tabPath(tab) },
    }))
  }

  function currentTabId(): string | undefined {
    const path = router.currentRoute.value.path
    return tabs.value.find(tab => tabPath(tab) === path)?.name
  }

  function post(message: Record<string, unknown>) {
    window.parent.postMessage({ channel: CHANNEL, v: VERSION, frameId: FRAME_ID, from: 'frame', ...message }, '*')
  }

  function announce(type: 'ready' | 'manifest') {
    post({ type, tabs: buildManifest(), current: currentTabId() })
  }

  window.addEventListener('message', (ev: MessageEvent) => {
    const data = ev.data
    if (!data || data.channel !== CHANNEL || data.v !== VERSION || data.frameId !== FRAME_ID || data.from !== 'host')
      return
    if (data.type === 'hello') {
      announce('ready')
    }
    else if (data.type === 'navigate') {
      const path = data.navTarget?.path
      if (typeof path === 'string')
        router.push(path).then(() => post({ type: 'navigated', tabId: data.tabId }))
    }
  })

  // Announce proactively in case the host attached before this shim loaded.
  announce('ready')

  // Re-announce when the tab set changes.
  watch(() => tabs.value.map(t => t.name).join(','), () => announce('manifest'))

  // Report in-app navigation so the dock highlight follows.
  watch(() => router.currentRoute.value.path, () => {
    const id = currentTabId()
    if (id)
      post({ type: 'navigated', tabId: id })
  })
}
