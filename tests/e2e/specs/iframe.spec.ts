import { expect, test } from '../fixtures/devtools'

// Nuxt DevTools is dev-only — no devtools UI exists in built/preview mode.
test.skip(({ mode }) => mode !== 'dev', 'devtools UI is dev-mode only')

test('devtools iframe loads chromelessly in the shared-frame anchor', async ({ page, openDevTools, devtoolsFrame }) => {
  await page.goto('/')
  await openDevTools()
  // The client renders chromelessly as the shared-frame anchor: there is no
  // in-app SideNav (the dock's per-tab members provide navigation) and the
  // current tab's content fills the iframe.
  await expect(devtoolsFrame().locator('#nuxt-devtools-side-nav')).toHaveCount(0)
  await expect(devtoolsFrame().locator('body'))
    .toContainText(/components|imports|plugins/i, { timeout: 30_000 })
})
