import { expect, test } from '../fixtures/devtools'

// Vite DevTools UI (and its dock registry) is dev-mode only.
test.skip(({ mode }) => mode !== 'dev', 'devtools UI is dev-mode only')

// The a11y devframe's default id — also its dock entry id once mounted.
const A11Y_ID = 'devframes_plugin_a11y'

test('mounts the a11y inspector in the Nuxt group with the agent client script', async ({ page, openDevTools }) => {
  await page.goto('/')
  await openDevTools()

  // The a11y dock member registers a moment after the group; poll for it.
  await page.waitForFunction((id) => {
    const ctx = (globalThis as any).__VITE_DEVTOOLS_CLIENT_CONTEXT__
    return ctx?.docks?.entries?.some((entry: any) => entry.id === id)
  }, A11Y_ID, { timeout: 30_000 })

  const entry = await page.evaluate((id) => {
    const ctx = (globalThis as any).__VITE_DEVTOOLS_CLIENT_CONTEXT__
    return ctx.docks.entries.find((e: any) => e.id === id)
  }, A11Y_ID)

  // Mounted as a member of the `nuxt` group, in the framework category (the
  // definition defaults to `~builtin`; the per-mount override must win).
  expect(entry).toMatchObject({
    id: A11Y_ID,
    type: 'iframe',
    groupId: 'nuxt',
    category: 'framework',
  })

  // The in-page axe-core agent is attached as the dock's client script so the
  // hub can inject it into the host page.
  expect(entry.clientScript?.importFrom).toContain('/@fs/')
  expect(entry.clientScript?.importFrom).toContain('inject')
})
