import type { ModuleBuiltinTab, ModuleCustomTab } from '~/../src/types'
import { computed, watch } from 'vue'
import { useRouter } from '#app/composables/router'
import { useEnabledTabs } from '~/composables/state-tabs'

// `devframe:frame-nav` — the embedded-app half of the shared-iframe soft-nav
// protocol (devframe#128 / vitejs/devtools#464). The Vite DevTools dock owns
// one kept-alive iframe (the anchor); this shim announces one member dock per
// DevTools tab and switches views by client-side navigation, so no per-tab
// iframe/reload is needed. The shim is transport-only: it takes no hub/RPC
// dependency, just `postMessage`.
//
// The announced set comes from `useEnabledTabs()` — so a tab's `show()`
// condition, hidden/pinned settings and experimental gating decide whether its
// dock appears, and the manifest is re-announced whenever that set changes.
const CHANNEL = 'devframe:frame-nav'
const VERSION = 1
// Must match the anchor's `frameId` registered in `module-main.ts`.
const FRAME_ID = 'nuxt:devtools'

const ICON_CLASS_RE = /\s.*$/
const FIRST_DASH_RE = /-/

interface FrameNavTab {
  id: string
  title: string
  icon?: string
  category?: string
  defaultOrder?: number
  navTarget: { path: string }
}

/** The DevTools settings page, surfaced as its own dock member. */
const SETTINGS_TAB: FrameNavTab = {
  id: 'settings',
  title: 'Settings',
  icon: 'carbon:settings',
  category: '~builtin',
  // sort last within its sub-category (higher `order` renders earlier)
  defaultOrder: 1000,
  navTarget: { path: '/settings' },
}

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
 * (conditional) tab manifest, answers `navigate` with client-side navigation,
 * and reports `navigated` so the dock highlight follows in-app navigation.
 */
export function setupFrameNav(): void {
  if (typeof window === 'undefined' || window.parent === window)
    return

  const router = useRouter()
  const tabs = useEnabledTabs()

  const manifest = computed<FrameNavTab[]>(() => [
    ...tabs.value.map(tab => ({
      id: tab.name,
      title: tab.title ?? tab.name,
      icon: normalizeIcon(tab.icon),
      defaultOrder: 'defaultOrder' in tab ? tab.defaultOrder : undefined,
      // An uncategorised tab belongs to `app`, so the `Nuxt` group's
      // `categoryOrder` weights apply to it.
      category: tab.category || 'app',
      navTarget: { path: tabPath(tab) },
    })),
    SETTINGS_TAB,
  ])

  function currentTabId(): string | undefined {
    const path = router.currentRoute.value.path
    return manifest.value.find(entry => entry.navTarget.path === path)?.id
  }

  function post(message: Record<string, unknown>) {
    window.parent.postMessage({ channel: CHANNEL, v: VERSION, frameId: FRAME_ID, from: 'frame', ...message }, '*')
  }

  function announce(type: 'ready' | 'manifest') {
    post({ type, tabs: manifest.value, current: currentTabId() })
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

  // Re-announce when the conditional tab set changes (show()/settings/etc).
  watch(() => manifest.value.map(entry => entry.id).join(','), () => announce('manifest'))

  // Report in-app navigation so the dock highlight follows.
  watch(() => router.currentRoute.value.path, () => {
    const id = currentTabId()
    if (id)
      post({ type: 'navigated', tabId: id })
  })
}
