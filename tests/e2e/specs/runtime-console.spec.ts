import { expect, test } from '../fixtures/devtools'

test.skip(({ playground, mode }) => playground !== 'empty' || mode !== 'dev', 'runtime console: empty playground, dev mode')

test('DevTools renders interactive component rows without runtime diagnostics', async ({ page, openDevTools, navigateTab, devtoolsFrame }) => {
  const diagnostics: string[] = []
  const reportedRuntimeProblems = [
    /does not provide an export named 'default'/i,
    /NUXT_E(?:3003|3004|4007|4011)/,
    /VUE_ROUTER_R0004/,
    /Property "(?:finalTheme|getTargetNodes|themeClass|slotData)" was accessed during render but is not defined/,
    /Cannot destructure property 'popperId'/,
  ]

  page.on('pageerror', error => diagnostics.push(error.message))
  page.on('console', (message) => {
    const text = message.text()
    if (reportedRuntimeProblems.some(pattern => pattern.test(text)))
      diagnostics.push(text)
  })

  await page.goto('/')
  await openDevTools()
  await navigateTab('/modules/components')
  const frame = devtoolsFrame()
  await expect(frame.locator('body')).toContainText(/Built-in components/i, { timeout: 15_000 })
  await page.waitForTimeout(500)

  await expect.soft(frame.locator('body')).toContainText('NuxtLink', { timeout: 15_000 })
  expect.soft(diagnostics, diagnostics.join('\n')).toEqual([])
})
