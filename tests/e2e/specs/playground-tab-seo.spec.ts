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

test('leaves the populated Pages dock through the expanded sidebar without emptying the frame', async ({ page, openDevTools, devtoolsFrame }) => {
  const pageErrors: Error[] = []
  page.on('pageerror', error => pageErrors.push(error))

  await page.goto('/')
  await openDevTools()

  const pages = page.getByRole('button', { name: 'Pages', exact: true })
  const showMore = page.getByRole('button', { name: 'Show more', exact: true })
  for (const sidebarTitle of ['Hooks', 'Virtual Files', 'Debug', 'Data Inspector']) {
    await pages.click()
    await expect(devtoolsFrame().locator('body'))
      .toContainText(/dynamic-\[name\]|\/full|\/empty/, { timeout: 15_000 })

    const sidebarDock = page.getByRole('button', { name: sidebarTitle, exact: true })
    if (!await sidebarDock.isVisible())
      await showMore.click()
    await sidebarDock.click()
    await expect(devtoolsFrame().locator('#nuxt-devtools-app')).toBeAttached()
    await expect(devtoolsFrame().locator('body')).not.toBeEmpty()
  }

  expect(pageErrors.map(error => error.message)).not.toContainEqual(
    expect.stringMatching(/Cannot read properties of undefined \(reading 'isShown'\)/),
  )
})
