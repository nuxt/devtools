import type { ViteDevToolsNodeContext } from '@vitejs/devtools-kit'
import type { ModuleCustomTab, NuxtDevtoolsServerContext } from '../types'
import { NUXT_DEVTOOLS_GROUP_ID } from '@nuxt/devtools-kit'

/**
 * Static list of the built-in DevTools tabs.
 *
 * The canonical source of these tabs is each client page's `definePageMeta`
 * under `client/pages/modules/*.vue`, which is only assembled at runtime in the
 * browser (via Vue Router, see `client/composables/state-tabs.ts`). Registering
 * one dock entry per tab happens on the Node side, which has no access to that
 * router table — so we mirror the metadata here.
 *
 * This is an intentional, temporary bridge: once Devframe supports client-only
 * dock definitions (register + postMessage), the client can push its own tab
 * list and this hardcoded copy can be dropped.
 */
interface BuiltinTab {
  /** Route name, matches the file under `client/pages/modules/<name>.vue`. */
  name: string
  title: string
  icon: string
  /** Lower renders earlier (matches `definePageMeta({ order })`); default 100. */
  order?: number
  /**
   * DevTools tab category, mirrored from each page's `definePageMeta`. Because
   * the entry belongs to the `Nuxt` group, this is reinterpreted by the dock as
   * an in-group **sub-category** that sub-divides the group popover/sidebar.
   */
  category?: string
}

const BUILTIN_TABS: BuiltinTab[] = [
  { name: 'overview', title: 'Overview', icon: 'carbon-information', order: -100, category: 'app' },
  { name: 'pages', title: 'Pages', icon: 'carbon-tree-view-alt', order: 1, category: 'app' },
  { name: 'components', title: 'Components', icon: 'i-carbon-assembly-cluster', order: 2, category: 'app' },
  { name: 'imports', title: 'Imports', icon: 'carbon-function', order: 4, category: 'app' },
  { name: 'modules', title: 'Modules', icon: 'carbon-3d-mpr-toggle', order: 5, category: 'app' },
  { name: 'assets', title: 'Assets', icon: 'carbon-image-copy', category: 'app' },
  { name: 'error', title: 'Error', icon: 'i-carbon-warning-alt-filled', category: 'app' },
  { name: 'render-tree', title: 'Render Tree', icon: 'i-carbon-category', order: 1, category: 'vue-devtools' },
  { name: 'pinia', title: 'Pinia', icon: 'i-logos-pinia', category: 'vue-devtools' },
  { name: 'runtime-configs', title: 'Runtime Configs', icon: 'carbon-settings-services', order: 6, category: 'analyze' },
  { name: 'payload', title: 'Payload', icon: 'carbon-data-set', order: 7, category: 'analyze' },
  { name: 'open-graph', title: 'Open Graph', icon: 'carbon:image-search', category: 'analyze' },
  { name: 'timeline', title: 'Timeline', icon: 'i-carbon-roadmap', category: 'analyze' },
  { name: 'analyze-build', title: 'Build Analyze', icon: 'carbon-edge-node', category: 'analyze' },
  { name: 'plugins', title: 'Plugins', icon: 'carbon-plug', category: 'analyze' },
  { name: 'server-routes', title: 'Server Routes', icon: 'carbon-cloud', category: 'server' },
  { name: 'server-tasks', title: 'Server Tasks', icon: 'codicon-run-all', category: 'server' },
  { name: 'storage', title: 'Storage', icon: 'carbon-data-base', category: 'server' },
  { name: 'hooks', title: 'Hooks', icon: 'carbon-ibm-cloud-direct-link-2-connect', category: 'advanced' },
  { name: 'virtual-files', title: 'Virtual Files', icon: 'i-carbon-border-none', category: 'advanced' },
  { name: 'debug', title: 'Debug', icon: 'i-carbon-debug', category: 'advanced' },
]

const FALLBACK_ICON = 'carbon:application'

/**
 * Normalise a tab icon into a form the dock can render.
 *
 * Tab metadata uses a mix of UnoCSS preset-icons style (`i-carbon-foo`,
 * `carbon-foo`) and raw iconify names (`carbon:foo`), sometimes with trailing
 * utility classes (`i-carbon-warning-alt-filled text-red`). Image URLs and
 * absolute paths are passed through untouched.
 */
function normalizeIcon(icon: string | undefined): string {
  if (!icon)
    return FALLBACK_ICON

  // Drop any trailing utility classes, keep only the icon token.
  let token = icon.trim().split(/\s+/)[0] ?? ''
  if (!token)
    return FALLBACK_ICON

  // Image URLs / absolute paths are used as-is.
  if (/^(?:https?:)?\/\//.test(token) || token.startsWith('/') || token.startsWith('data:'))
    return token

  if (token.startsWith('i-'))
    token = token.slice(2)

  // Convert UnoCSS `collection-name` to iconify `collection:name`.
  if (!token.includes(':'))
    token = token.replace('-', ':')

  return token
}

/**
 * Projects every Nuxt DevTools tab (built-in + module custom tabs) as its own
 * iframe dock entry inside the `Nuxt` dock group, each pointing at a chromeless
 * deep link under the client's `/embed/` sub-path (`<client>/embed/modules/<name>`).
 * The `/embed/*` route mounts just that tab's content — no SideNav, no split
 * pane — so the tab takes the full iframe.
 *
 * Registration happens on the Node side (`ctx.docks.register` only exists there),
 * so built-in tabs come from the static list above and custom tabs are collected
 * via the `devtools:customTabs` hook and kept in sync on `devtools:customTabs:refresh`.
 *
 * Each entry sets `groupId: 'nuxt'`, so its `category` is reinterpreted by the
 * dock as an in-group sub-category (`@vitejs/devtools` >= 0.4.4 / `@devframes/hub`
 * >= 0.7.10) that sub-divides the `Nuxt` group.
 */
export function setup(ctx: NuxtDevtoolsServerContext, routeClient: string): void {
  const { nuxt, options } = ctx

  // register handle per dock id, so we can update/hide entries later
  const handles = new Map<string, { update: (patch: Record<string, unknown>) => void }>()
  const customIds = new Set<string>()

  let kit: ViteDevToolsNodeContext | undefined

  const entryId = (name: string) => `nuxt:devtools:${name}`
  const embedUrl = (path: string) => `${routeClient}/embed${path}`

  function upsert(entry: Record<string, unknown> & { id: string }) {
    if (!kit)
      return
    const existing = handles.get(entry.id)
    if (existing) {
      // Re-show a previously hidden entry and refresh its metadata. Note: an
      // already-open iframe won't re-navigate on url change (platform gap).
      existing.update({ when: undefined, ...entry })
    }
    else {
      handles.set(entry.id, kit.docks.register(entry as any))
    }
  }

  function registerBuiltinTabs() {
    for (const tab of BUILTIN_TABS) {
      upsert({
        id: entryId(tab.name),
        type: 'iframe',
        title: tab.title,
        icon: normalizeIcon(tab.icon),
        url: embedUrl(`/modules/${tab.name}`),
        groupId: NUXT_DEVTOOLS_GROUP_ID,
        // in-group sub-category (grouped entry: `category` is the sub-bucket)
        category: tab.category ?? 'app',
        // dock `defaultOrder`: higher renders earlier; tab `order`: lower first.
        defaultOrder: -(tab.order ?? 100),
      })
    }
  }

  async function collectCustomTabs(): Promise<ModuleCustomTab[]> {
    const tabs: ModuleCustomTab[] = []
    if (options.customTabs?.length)
      tabs.push(...options.customTabs)
    await nuxt.callHook('devtools:customTabs', tabs)
    return tabs
  }

  async function syncCustomTabs() {
    if (!kit)
      return

    const tabs = await collectCustomTabs()
    const seen = new Set<string>()

    tabs.forEach((tab, index) => {
      const id = entryId(`custom-${tab.name}`)
      seen.add(id)
      customIds.add(id)
      upsert({
        id,
        type: 'iframe',
        title: tab.title,
        icon: normalizeIcon(tab.icon),
        url: embedUrl(`/modules/custom-${tab.name}`),
        groupId: NUXT_DEVTOOLS_GROUP_ID,
        // in-group sub-category; custom tabs default to `modules`
        category: tab.category || 'modules',
        // keep custom tabs after the built-in set
        defaultOrder: -1000 - index,
      })
    })

    // The dock host has no `unregister`; hide tabs that disappeared instead.
    for (const id of customIds) {
      if (!seen.has(id))
        handles.get(id)?.update({ when: 'false' })
    }
  }

  nuxt.hook('devtools:ready', async (kitCtx: ViteDevToolsNodeContext) => {
    kit = kitCtx
    registerBuiltinTabs()
    await syncCustomTabs()
  })

  nuxt.hook('devtools:customTabs:refresh', () => {
    syncCustomTabs()
  })
}
