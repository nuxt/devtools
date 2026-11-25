import { expect, test } from '../fixtures/devtools'

test.skip(
  ({ playground, mode }) => playground !== 'tab-seo' || mode !== 'dev',
  'tab-seo playground, dev mode only',
)

test('Open Graph tab shows page title from playground', async ({ page, openDevTools }) => {
  await page.goto('/')
  await openDevTools()
  // Open Graph is a standalone Devframe dock (@devframes/plugin-og).
  const showMore = page.getByRole('button', { name: 'Show more', exact: true })
  const dock = page.getByRole('button', { name: /open graph/i })
  if (!await dock.isVisible())
    await showMore.click()
  await dock.click()
  // index.vue sets useHead({ title: 'Home page' }) plus og:title / og:description.
  // The viewer mounts in its own iframe, separate from the Nuxt client.
  await expect(page.frameLocator('iframe[src*="devframes_plugin_og"]').locator('body'))
    .toContainText('Home page', { timeout: 15_000 })
})

test('leaves the populated Pages dock through the expanded sidebar without emptying the frame', async ({ page, openDevTools, devtoolsFrame }) => {
  const pageErrors: Error[] = []
  page.on('pageerror', error => pageErrors.push(error))

  await page.goto('/')
  await openDevTools()

  // Once a dock is selected, the floating dock (`#devframes-dock`) renders the
  // same entries next to the expanded sidebar; only target the sidebar ones.
  const sidebarButton = (name: string) => page.getByRole('button', { name, exact: true })
    .and(page.locator(':not(#devframes-dock *)'))
  const pages = sidebarButton('Pages')
  const showMore = page.getByRole('button', { name: 'Show more', exact: true })
  for (const sidebarTitle of [
    'Hooks',
    'Virtual Files',
    'Debug',
    'Data Inspector',
  ]) {
    await pages.click()
    await expect(devtoolsFrame().locator('body'))
      .toContainText(/dynamic-\[name\]|\/full|\/empty/, { timeout: 15_000 })

    const sidebarDock = sidebarButton(sidebarTitle)
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
