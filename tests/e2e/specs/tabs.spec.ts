import { expect, test } from '../fixtures/devtools'

test.skip(({ mode }) => mode !== 'dev', 'devtools UI is dev-mode only')

const TABS = [
  {
    path: '/modules/overview',
    title: 'Overview',
    // Overview shows counters like "13 components 188 imports 17 plugins"
    contentMatch: /components.*imports/i,
  },
  {
    path: '/modules/components',
    title: 'Components',
    contentMatch: /built-in|runtime|user/i,
  },
  {
    path: '/modules/imports',
    title: 'Imports',
    contentMatch: /composable|component|util/i,
  },
  {
    path: '/modules/modules',
    title: 'Modules',
    contentMatch: /installed modules/i,
  },
  {
    path: '/modules/runtime-configs',
    title: 'Runtime Configs',
    contentMatch: /public|app/i,
  },
  {
    path: '/modules/hooks',
    title: 'Hooks',
    contentMatch: /hook|server|client/i,
  },
  {
    path: '/modules/plugins',
    title: 'Plugins',
    contentMatch: /plugin/i,
  },
  {
    path: '/modules/open-graph',
    title: 'Open Graph',
    contentMatch: /open graph|meta|preview/i,
  },
] as const

test.describe('main tabs', () => {
  for (const tab of TABS) {
    test(`${tab.title}: navigates and renders content`, async ({ page, openDevTools, navigateTab, devtoolsFrame }) => {
      await page.goto('/')
      await openDevTools()
      await navigateTab(tab.path)
      // Tab content area should reflect the new route. Match a string that's
      // unique to this tab's body content.
      await expect(devtoolsFrame().locator('body')).toContainText(tab.contentMatch, { timeout: 15_000 })
    })
  }
})
