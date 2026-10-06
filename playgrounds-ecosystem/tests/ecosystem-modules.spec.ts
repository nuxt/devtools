import { expect, test } from '../../tests/e2e/fixtures/devtools'

// Smoke test: each ecosystem module that ships a Nuxt DevTools integration
// should register its custom tab, and that tab should render against this
// repo's own devtools client (not the "Tab <name> not found" fallback).
//
// Custom tabs live at `/modules/custom-<name>` in the devtools client
// (see packages/devtools/client/pages/modules/custom-[name].vue). For
// iframe-type tabs, the client appends an <iframe> pointing at the module's
// own dev route into the devtools document — its presence proves the tab
// mounted its view. For the launch-type tab (@nuxt/eslint), we assert the
// launch panel's copy instead.
interface ModuleTab {
  /** npm module under test. */
  module: string
  /** `tab.name` the module registers (route becomes `/modules/custom-<name>`). */
  name: string
  /** How the tab renders its view. */
  view: 'iframe' | 'launch'
  /** For `iframe` tabs: a substring of the inner iframe's `src`. */
  iframeSrc?: string
  /** For `launch` tabs: text expected on the launch panel. */
  text?: RegExp
}

// This combined dev server can briefly restart once early in the run (Nuxt
// regenerating types / a module wiring up), which surfaces as a transient
// ERR_CONNECTION_REFUSED on the first navigation. Retry the initial load until
// the server answers rather than failing the whole test on a blip.
async function gotoAppRoot(page: import('@playwright/test').Page) {
  await expect(async () => {
    const res = await page.goto('/')
    expect(res?.ok(), `GET / → ${res?.status()}`).toBeTruthy()
  }).toPass({ timeout: 60_000, intervals: [500, 1000, 2000, 3000] })
}

const MODULE_TABS: ModuleTab[] = [
  // nuxt-og-image ships a placeholder panel that offers to install its devtools layer.
  { module: 'nuxt-og-image', name: 'nuxt-seo-og-image', view: 'iframe', iframeSrc: '__nuxt-seo-devtools/og-image' },
  // @nuxt/scripts embeds its scripts panel.
  { module: '@nuxt/scripts', name: 'nuxt-scripts', view: 'iframe', iframeSrc: '__nuxt-scripts' },
  // @nuxt/fonts embeds its fonts panel.
  { module: '@nuxt/fonts', name: 'fonts', view: 'iframe', iframeSrc: '__nuxt-devtools-fonts' },
  // @nuxt/eslint contributes a lazy launcher for the ESLint config inspector.
  { module: '@nuxt/eslint', name: 'eslint-config', view: 'launch', text: /config inspector/i },
  // @nuxt/hints embeds its performance/security/hydration hints UI.
  { module: '@nuxt/hints', name: 'hints', view: 'iframe', iframeSrc: '__nuxt-hints' },
  // @nuxt/a11y embeds its real-time accessibility panel.
  { module: '@nuxt/a11y', name: 'nuxt-a11y', view: 'iframe', iframeSrc: '__nuxt-a11y-client' },
  // @compodium/nuxt embeds its component playground.
  { module: '@compodium/nuxt', name: 'compodium', view: 'iframe', iframeSrc: '__compodium__' },
  // @scalar/nuxt embeds its API reference (fed by Nitro's OpenAPI doc).
  { module: '@scalar/nuxt', name: 'scalar', view: 'iframe', iframeSrc: '/docs' },
]

test.describe('ecosystem module devtools tabs', () => {
  for (const tab of MODULE_TABS) {
    test(`${tab.module} → "${tab.name}" tab renders`, async ({ page, openDevTools, navigateTab, devtoolsFrame }) => {
      await gotoAppRoot(page)
      await openDevTools()
      await navigateTab(`/modules/custom-${tab.name}`)

      const frame = devtoolsFrame()
      if (tab.view === 'iframe') {
        // The tab mounted its IframeView, which appends the module's dev route
        // as an <iframe> into the devtools client document.
        await expect(frame.locator(`iframe[src*="${tab.iframeSrc}"]`))
          .toBeAttached({ timeout: 15_000 })
      }
      else {
        await expect(frame.locator('body'))
          .toContainText(tab.text!, { timeout: 15_000 })
      }
    })
  }
})

// `legacy-kit-v3/` is a module written against the published
// @nuxt/devtools-kit v3 — what most of the Nuxt 4 ecosystem still ships. It
// must keep working through the v4 shims, end to end, not just register.
test.describe('legacy @nuxt/devtools-kit v3 module', () => {
  test('tab, iframe client, RPC and terminal all work through the shims', async ({ page, openDevTools, navigateTab, devtoolsFrame }) => {
    await gotoAppRoot(page)
    await openDevTools()
    await navigateTab('/modules/custom-legacy-kit-v3')

    // `useDevtoolsClient()` connected (the Nuxt client injected `__NUXT_DEVTOOLS__`)
    // and `client.host` reaches the app.
    const view = devtoolsFrame().frameLocator('iframe[src*="__legacy-kit-v3"]')
    await expect(view.getByTestId('connected')).toHaveText('connected: yes', { timeout: 30_000 })
    await expect(view.getByTestId('host-vue')).toContainText(/host vue: \d+\.\d+/)

    // `extendServerRpc` → `extendClientRpc` round trip, and a server→client broadcast.
    await expect(view.getByTestId('echo')).toHaveText('echo: PING [from v3 rpc]')
    await expect(view.getByTestId('greeted')).toHaveText('greeted: legacy')

    // `startSubprocess` is bridged onto the Vite DevTools terminals host, which
    // suffixes each run of a legacy id (`legacy-kit-v3:echo#1`).
    const terminals = await page.evaluate(async () => {
      const ctx = (globalThis as any).__DEVFRAME_HUB_CLIENT_CONTEXT__
      const list: { id: string }[] = await ctx.rpc.call('devframes:plugin:terminals:list')
      return list.map(t => t.id)
    })
    expect(terminals.some(id => id.startsWith('legacy-kit-v3:echo'))).toBe(true)
  })
})
