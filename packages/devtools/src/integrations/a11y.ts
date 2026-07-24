import type { A11yIntegrationOptions, NuxtDevtoolsServerContext } from '../types'
import { a11yAgentBundlePath, createA11yDevframe } from '@devframes/plugin-a11y'
import { NUXT_DEVTOOLS_GROUP_ID, onDevtoolsReady } from '@nuxt/devtools-kit'
import { mountDevframe } from '@vitejs/devtools-kit/node'

/**
 * Mount the accessibility inspector Devframe into the Nuxt dock group.
 *
 * The plugin has two browser-side halves that talk over a same-origin
 * `BroadcastChannel`: the Solid **panel** (served as the dock iframe by
 * `mountDevframe`) and the in-page **agent** that runs axe-core against the
 * host app and draws the highlight overlay. Devframe deliberately exposes no
 * access to the host DOM, so the agent has to be injected into the page by the
 * host: we attach the plugin's prebuilt agent bundle as the dock's
 * `clientScript`, which the hub's client runtime imports into the app page and
 * boots. The bundle lives inside the installed package, so it is referenced
 * through Vite's `/@fs/` escape hatch (the DevTools UI, and therefore this
 * panel, is dev-mode only).
 *
 * Enabled by default; opt out with `devtools.a11y.enabled = false`.
 */
export function setup(ctx: NuxtDevtoolsServerContext): void {
  const { nuxt, options } = ctx

  const a11yOptions = options.a11y as A11yIntegrationOptions | undefined
  if (a11yOptions?.enabled === false)
    return

  const definition = createA11yDevframe()
  onDevtoolsReady((kit) => {
    // `mountDevframe` is re-exported from the hub package while the hook uses
    // the Vite kit's enriched context type; they are the same runtime object.
    return mountDevframe(kit as any, definition, {
      dock: {
        groupId: NUXT_DEVTOOLS_GROUP_ID,
        // The definition defaults to the `~builtin` category; group members do
        // not inherit their group's category, so it must be set per-mount.
        category: 'framework',
        defaultOrder: -150,
        // Inject the axe-core agent into the host page. `a11yAgentBundlePath` is
        // an absolute path inside the package; `/@fs/` makes it importable from
        // the Vite dev server that serves the app.
        clientScript: {
          importFrom: `/@fs/${a11yAgentBundlePath}`,
        },
      },
    })
  }, nuxt)
}
