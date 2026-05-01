import { expect, test } from '../fixtures/devtools'

test.skip(
  ({ playground, mode }) => playground !== 'tab-pinia' || mode !== 'dev',
  'tab-pinia playground, dev mode only',
)

test('Pinia tab navigates and dismisses connecting state', async ({ page, openDevTools, navigateTab, devtoolsFrame }) => {
  await page.goto('/')
  await openDevTools()
  await navigateTab('/modules/pinia')
  // Wait past the "Connecting..." loader; Pinia applet renders once Vue DevTools connects.
  await expect(devtoolsFrame().locator('body'))
    .not
    .toContainText('Connecting....', { timeout: 30_000 })
})
