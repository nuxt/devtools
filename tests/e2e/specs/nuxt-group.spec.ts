import { expect, test } from '../fixtures/devtools'

// Vite DevTools UI (and its dock registry) is dev-mode only.
test.skip(({ mode }) => mode !== 'dev', 'devtools UI is dev-mode only')

test('registers a single `Nuxt` group with `nuxt:devtools` as its default child', async ({ page, openDevTools }) => {
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

  // The `nuxt:devtools` entry is the shared-frame anchor: it owns one iframe
  // (its `frameId`) whose sub-tabs are discovered over postMessage.
  const hubEntry = await page.evaluate(() => {
    const ctx = (globalThis as any).__VITE_DEVTOOLS_CLIENT_CONTEXT__
    return ctx.docks.entries.find((entry: any) => entry.id === 'nuxt:devtools')
  })
  expect(hubEntry).toMatchObject({
    id: 'nuxt:devtools',
    type: 'iframe',
    groupId: 'nuxt',
    frameId: 'nuxt:devtools',
    subTabs: { protocol: 'postmessage' },
  })

  // Opening the anchor (driven by `openDevTools()`) starts the client's
  // `devframe:frame-nav` shim, which announces one member dock per enabled tab
  // (plus Settings). Those members share the anchor's iframe and soft-navigate.
  await page.waitForFunction(() => {
    const ctx = (globalThis as any).__VITE_DEVTOOLS_CLIENT_CONTEXT__
    return ctx.docks.entries.some((entry: any) => String(entry.id).startsWith('nuxt:devtools:'))
  }, null, { timeout: 30_000 })

  const memberIds = await page.evaluate(() => {
    const ctx = (globalThis as any).__VITE_DEVTOOLS_CLIENT_CONTEXT__
    return ctx.docks.entries
      .filter((entry: any) => String(entry.id).startsWith('nuxt:devtools:'))
      .map((entry: any) => entry.id)
  })
  expect(memberIds).toContain('nuxt:devtools:settings')
  expect(memberIds.length).toBeGreaterThan(1)
})
