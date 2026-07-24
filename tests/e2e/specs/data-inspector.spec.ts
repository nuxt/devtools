import { expect, test } from '../fixtures/devtools'

// Vite DevTools UI (and its dock registry) is dev-mode only.
test.skip(({ mode }) => mode !== 'dev', 'devtools UI is dev-mode only')

// The Data Inspector devframe's default id — also its RPC namespace.
const DATA_INSPECTOR_ID = 'devframes:plugin:data-inspector'
const NUXT_SOURCE_ID = 'nuxt:application'
const EXAMPLE_SOURCE_ID = 'devframes:plugin:data-inspector:example'

test('mounts the Data Inspector in the Nuxt group exposing only the Nuxt source', async ({ page, openDevTools }) => {
  await page.goto('/')
  await openDevTools()

  // The Data Inspector dock member registers a moment after the group; poll for it.
  await page.waitForFunction((id) => {
    const ctx = (globalThis as any).__VITE_DEVTOOLS_CLIENT_CONTEXT__
    return ctx?.docks?.entries?.some((entry: any) => entry.id === id)
  }, DATA_INSPECTOR_ID, { timeout: 30_000 })

  // Mounted as a member of the `nuxt` group, in the `advanced` in-group
  // category (the definition defaults to `~builtin`; the per-mount override
  // must win).
  const entry = await page.evaluate((id) => {
    const ctx = (globalThis as any).__VITE_DEVTOOLS_CLIENT_CONTEXT__
    return ctx.docks.entries.find((e: any) => e.id === id)
  }, DATA_INSPECTOR_ID)
  expect(entry).toMatchObject({
    id: DATA_INSPECTOR_ID,
    type: 'iframe',
    groupId: 'nuxt',
    category: 'advanced',
  })

  // The source picker contains the Nuxt source and NOT the built-in example.
  await expect.poll(async () => {
    return page.evaluate(async () => {
      const ctx = (globalThis as any).__VITE_DEVTOOLS_CLIENT_CONTEXT__
      const sources = await ctx.rpc.call('devframes:plugin:data-inspector:sources')
      return (sources as { id: string }[]).map(s => s.id)
    })
  }, { timeout: 30_000 }).toContain(NUXT_SOURCE_ID)

  const sourceIds = await page.evaluate(async () => {
    const ctx = (globalThis as any).__VITE_DEVTOOLS_CLIENT_CONTEXT__
    const sources = await ctx.rpc.call('devframes:plugin:data-inspector:sources')
    return (sources as { id: string }[]).map(s => s.id)
  })
  expect(sourceIds).not.toContain(EXAMPLE_SOURCE_ID)

  // Querying at least `nuxt` and `vite` against the live source succeeds.
  const results = await page.evaluate(async (sourceId) => {
    const ctx = (globalThis as any).__VITE_DEVTOOLS_CLIENT_CONTEXT__
    const nuxt = await ctx.rpc.call('devframes:plugin:data-inspector:query', sourceId, 'nuxt')
    const vite = await ctx.rpc.call('devframes:plugin:data-inspector:query', sourceId, 'vite')
    return { nuxt, vite }
  }, NUXT_SOURCE_ID)

  expect((results.nuxt as { ok: boolean }).ok).toBe(true)
  expect((results.vite as { ok: boolean }).ok).toBe(true)
})
