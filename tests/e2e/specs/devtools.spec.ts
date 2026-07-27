import { expect, test } from '../fixtures/devtools'

// The DevTools UI only exists in dev mode, and this core behaviour is identical
// across playgrounds — exercise it once, on the minimal `empty` playground.
test.skip(({ playground, mode }) => playground !== 'empty' || mode !== 'dev', 'core DevTools behaviour: empty playground, dev mode')

test('opens from the host app and renders the client chromelessly', async ({ page, openDevTools, devtoolsFrame }) => {
  await page.goto('/')
  await openDevTools()

  // Chromeless: the client is the shared-frame anchor, so it renders a tab's
  // content directly with no in-app side navigation (the dock provides that).
  await expect(devtoolsFrame().locator('#nuxt-devtools-side-nav')).toHaveCount(0)
  await expect(devtoolsFrame().locator('body'))
    .toContainText(/components|imports|plugins/i, { timeout: 30_000 })
})

test('registers a single Nuxt entry (no duplicate from the SSR Vite context)', async ({ page, openDevTools }) => {
  await page.goto('/')
  await openDevTools()

  // Regression guard for the SSR context registering a second, inert `Nuxt`
  // group. There is no user-visible proxy for "how many groups registered", so
  // this is the one place we read the dock registry — kept to a single count.
  const nuxtGroups = await page.evaluate(() => {
    const ctx = (globalThis as any).__VITE_DEVTOOLS_CLIENT_CONTEXT__
    return ctx.docks.entries.filter((entry: any) => entry.id === 'nuxt').length
  })
  expect(nuxtGroups).toBe(1)
})
