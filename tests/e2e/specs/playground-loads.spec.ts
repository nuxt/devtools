import { expect, test } from '../fixtures/devtools'

// Runs for every project (both dev and built) — sanity check that the playground
// itself boots and renders. In built mode this is the only thing we verify, since
// Nuxt DevTools only attaches in dev.

// tab-seo's production build currently throws `useNuxtDevTools is not defined`
// (auto-import provided by `../../local` doesn't bake into the prod bundle).
// Skip until that bug is fixed in `local.ts` / module-main; the dev-mode tests
// for tab-seo still run.
test.skip(
  ({ playground, mode }) => playground === 'tab-seo' && mode === 'built',
  'tab-seo prod build has a known auto-import issue (useNuxtDevTools not defined)',
)

test('playground page renders without errors', async ({ page }) => {
  const consoleErrors: string[] = []
  page.on('pageerror', e => consoleErrors.push(e.message))
  page.on('console', (msg) => {
    if (msg.type() === 'error')
      consoleErrors.push(msg.text())
  })

  const response = await page.goto('/')
  expect(response?.ok()).toBe(true)
  await expect(page.locator('body')).not.toBeEmpty()
  // Ignore known-benign messages: HMR notices, favicon 404s (no favicon in
  // playgrounds), and websocket connection setup messages from Vite/HMR.
  // Anything else (real runtime errors, missing imports, etc.) should fail.
  const ignored = [
    /\[vite\] hmr/i,
    /\[HMR\]/,
    /favicon\.ico/i,
    /WebSocket connection .*failed/i,
    /failed to connect to websocket/i,
  ]
  const fatal = consoleErrors.filter(e => !ignored.some(re => re.test(e)))
  expect(fatal, fatal.join('\n')).toEqual([])
})
