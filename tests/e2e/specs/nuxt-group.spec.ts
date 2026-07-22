import { expect, test } from '../fixtures/devtools'

// Vite DevTools UI (and its dock registry) is dev-mode only.
test.skip(({ mode }) => mode !== 'dev', 'devtools UI is dev-mode only')

test('registers a single `Nuxt` group with `nuxt:devtools` as its default child', async ({ page, openDevTools, devtoolsFrame }) => {
  await page.goto('/')
  await openDevTools()

  const groupEntries = await page.evaluate(() => {
    const ctx = (globalThis as any).__VITE_DEVTOOLS_CLIENT_CONTEXT__
    return ctx.docks.entries.filter((entry: any) => entry.id === 'nuxt')
  })

  // Exactly one `nuxt` group — Nuxt's SSR Vite context must never register a
  // second, inert group + hub member.
  expect(groupEntries).toHaveLength(1)
  expect(groupEntries[0]).toMatchObject({
    id: 'nuxt',
    type: 'group',
    title: 'Nuxt',
    category: 'framework',
    defaultChildId: 'nuxt:devtools',
  })

  const hubEntry = await page.evaluate(() => {
    const ctx = (globalThis as any).__VITE_DEVTOOLS_CLIENT_CONTEXT__
    return ctx.docks.entries.find((entry: any) => entry.id === 'nuxt:devtools')
  })
  expect(hubEntry).toMatchObject({
    id: 'nuxt:devtools',
    type: 'iframe',
    groupId: 'nuxt',
  })

  // Opening the hub (already driven by `openDevTools()` via `switchEntry`)
  // still hydrates the full SideNav.
  await expect(devtoolsFrame().locator('#nuxt-devtools-side-nav'))
    .toBeVisible({ timeout: 30_000 })
})
