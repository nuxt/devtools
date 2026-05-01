import { expect, test } from '../fixtures/devtools'

test.skip(({ playground, mode }) => playground !== 'empty' || mode !== 'dev', 'empty playground, dev mode only')

test('Modules tab renders with section heading', async ({ page, openDevTools, navigateTab, devtoolsFrame }) => {
  await page.goto('/')
  await openDevTools()
  await navigateTab('/modules/modules')
  // The Modules tab renders an "Installed Modules" section regardless of count.
  await expect(devtoolsFrame().locator('body'))
    .toContainText(/installed modules/i, { timeout: 15_000 })
})

test('Components tab lists at least one built-in component', async ({ page, openDevTools, navigateTab, devtoolsFrame }) => {
  await page.goto('/')
  await openDevTools()
  await navigateTab('/modules/components')
  // empty's app.vue has no user components, but Nuxt always provides built-ins like NuxtPage/NuxtLink
  await expect(devtoolsFrame().locator('body'))
    .toContainText(/NuxtPage|NuxtLink|NuxtLayout/, { timeout: 15_000 })
})
