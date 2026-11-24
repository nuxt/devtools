import { expect, test } from '../fixtures/devtools'

// Icon resolution is playground-independent — run it once, on `empty`.
test.skip(({ playground, mode }) => playground !== 'empty' || mode !== 'dev', 'icons: empty playground, dev mode')

// #917: the DevTools client must not load icons from a CDN, so it keeps working
// offline and under strict CSP. Icons come from local Iconify collections, via
// the dev server.
test('client renders icons without requesting api.iconify.design', async ({ page, openDevTools, navigateTab, devtoolsFrame }) => {
  const cdnRequests: string[] = []
  page.on('request', (request) => {
    if (!request.url().includes('api.iconify.design'))
      return
    // The Vite DevTools dock outside our iframe has its own icon loader; only
    // the Nuxt DevTools client is under test here.
    if (request.frame().url().includes('__nuxt_devtools__/client'))
      cdnRequests.push(request.url())
  })

  await page.goto('/')
  await openDevTools()
  await navigateTab('/modules/components')

  // `NIcon` inlines the resolved SVG instead of falling back to its class.
  await expect.soft(devtoolsFrame().locator('.n-icon > svg').first()).toBeVisible({ timeout: 15_000 })
  expect(cdnRequests).toEqual([])
})
