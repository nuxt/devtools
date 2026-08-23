import { expect, test } from '../fixtures/devtools'

// Tab navigation behaviour is playground-independent — run it once, on `empty`.
test.skip(({ playground, mode }) => playground !== 'empty' || mode !== 'dev', 'tab navigation: empty playground, dev mode')

// Each tab is identified by a stable, user-visible string in its rendered body.
// We navigate through the public host API and assert the content the user sees,
// rather than the client's routes or internal component tree.
const TABS = [
  { path: '/modules/overview', title: 'Overview', content: /components.*imports/i },
  { path: '/modules/components', title: 'Components', content: /built-in|runtime|user/i },
  { path: '/modules/imports', title: 'Imports', content: /composable|component|util/i },
  { path: '/modules/modules', title: 'Modules', content: /installed modules/i },
  { path: '/modules/runtime-configs', title: 'Runtime Configs', content: /public|app/i },
  { path: '/modules/hooks', title: 'Hooks', content: /hook|server|client/i },
  { path: '/modules/plugins', title: 'Plugins', content: /plugin/i },
  { path: '/modules/open-graph', title: 'Open Graph', content: /open graph|meta|preview/i },
] as const

test.describe('main tabs', () => {
  for (const tab of TABS) {
    test(`${tab.title} renders its content`, async ({ page, openDevTools, navigateTab, devtoolsFrame }) => {
      await page.goto('/')
      await openDevTools()
      await navigateTab(tab.path)
      await expect(devtoolsFrame().locator('body')).toContainText(tab.content, { timeout: 15_000 })
    })
  }
})

test('lists Nuxt built-in components even with no user components', async ({ page, openDevTools, navigateTab, devtoolsFrame }) => {
  await page.goto('/')
  await openDevTools()
  await navigateTab('/modules/components')
  await expect(devtoolsFrame().locator('body'))
    .toContainText(/Built-in components/i, { timeout: 15_000 })
  await expect(devtoolsFrame().locator('body'))
    .toContainText(/Total components: \d+/i, { timeout: 15_000 })
  await expect(devtoolsFrame().locator('body'))
    .toContainText('NuxtLink', { timeout: 15_000 })
})
