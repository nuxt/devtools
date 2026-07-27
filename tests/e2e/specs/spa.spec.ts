import { expect, test } from '../fixtures/devtools'

// The `spa` playground runs with `ssr: false` + `experimental.viteEnvironmentApi`,
// the code path where `addVitePlugin`'s `applyToEnvironment` wrapper used to
// silently drop the Nuxt DevTools dock entry. If DevTools opens and renders
// here, the dock entry registered correctly under that code path.
test.skip(({ playground, mode }) => playground !== 'spa' || mode !== 'dev', 'ssr:false regression: spa playground, dev mode')

test('DevTools still opens under ssr:false', async ({ page, openDevTools, devtoolsFrame }) => {
  await page.goto('/')
  await openDevTools()
  await expect(devtoolsFrame().locator('body'))
    .toContainText(/components|imports|plugins/i, { timeout: 30_000 })
})
