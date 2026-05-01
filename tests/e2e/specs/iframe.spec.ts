import { expect, test } from '../fixtures/devtools'

// Nuxt DevTools is dev-only — no devtools UI exists in built/preview mode.
test.skip(({ mode }) => mode !== 'dev', 'devtools UI is dev-mode only')

test('devtools iframe loads with side nav visible', async ({ page, openDevTools, devtoolsFrame }) => {
  await page.goto('/')
  await openDevTools()
  await expect(devtoolsFrame().locator('#nuxt-devtools-side-nav'))
    .toBeVisible({ timeout: 30_000 })
})
