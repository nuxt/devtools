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
