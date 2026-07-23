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
}

const BUILTIN_TABS: BuiltinTab[] = [
  { name: 'overview', title: 'Overview', icon: 'carbon-information', order: -100 },
  { name: 'pages', title: 'Pages', icon: 'carbon-tree-view-alt', order: 1 },
  { name: 'components', title: 'Components', icon: 'i-carbon-assembly-cluster', order: 2 },
  { name: 'imports', title: 'Imports', icon: 'carbon-function', order: 4 },
  { name: 'modules', title: 'Modules', icon: 'carbon-3d-mpr-toggle', order: 5 },
  { name: 'runtime-configs', title: 'Runtime Configs', icon: 'carbon-settings-services', order: 6 },
  { name: 'payload', title: 'Payload', icon: 'carbon-data-set', order: 7 },
  { name: 'render-tree', title: 'Render Tree', icon: 'i-carbon-category', order: 1 },
  { name: 'pinia', title: 'Pinia', icon: 'i-logos-pinia' },
  { name: 'assets', title: 'Assets', icon: 'carbon-image-copy' },
  { name: 'server-routes', title: 'Server Routes', icon: 'carbon-cloud' },
  { name: 'server-tasks', title: 'Server Tasks', icon: 'codicon-run-all' },
  { name: 'storage', title: 'Storage', icon: 'carbon-data-base' },
  { name: 'open-graph', title: 'Open Graph', icon: 'carbon:image-search' },
  { name: 'timeline', title: 'Timeline', icon: 'i-carbon-roadmap' },
  { name: 'analyze-build', title: 'Build Analyze', icon: 'carbon-edge-node' },
  { name: 'plugins', title: 'Plugins', icon: 'carbon-plug' },
  { name: 'hooks', title: 'Hooks', icon: 'carbon-ibm-cloud-direct-link-2-connect' },
  { name: 'virtual-files', title: 'Virtual Files', icon: 'i-carbon-border-none' },
  { name: 'debug', title: 'Debug', icon: 'i-carbon-debug' },
  { name: 'error', title: 'Error', icon: 'i-carbon-warning-alt-filled' },
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
 * deep link (`<client>/embed/modules/<name>`).
 *
 * Registration happens on the Node side (`ctx.docks.register` only exists there),
 * so built-in tabs come from the static list above and custom tabs are collected
 * via the `devtools:customTabs` hook and kept in sync on `devtools:customTabs:refresh`.
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
