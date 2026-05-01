import { expect, test } from '../fixtures/devtools'

test.skip(
  ({ playground, mode }) => playground !== 'tab-seo' || mode !== 'dev',
  'tab-seo playground, dev mode only',
)

test('Open Graph tab shows page title from playground', async ({ page, openDevTools, navigateTab, devtoolsFrame }) => {
  await page.goto('/')
  await openDevTools()
  await navigateTab('/modules/open-graph')
  // index.vue sets useHead({ title: 'Home page' }) plus og:title / og:description.
  // The Open Graph tab renders these meta values.
  await expect(devtoolsFrame().locator('body'))
    .toContainText('Home page', { timeout: 15_000 })
})
