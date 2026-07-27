import { expect, test } from '../fixtures/devtools'

// Plugin integration behaviour is playground-independent — run once, on `empty`.
test.skip(({ playground, mode }) => playground !== 'empty' || mode !== 'dev', 'Data Inspector: empty playground, dev mode')

const NUXT_SOURCE_ID = 'nuxt:application'
const EXAMPLE_SOURCE_ID = 'devframes:plugin:data-inspector:example'

async function inspectorSources(page: any): Promise<string[]> {
  return page.evaluate(async () => {
    const ctx = (globalThis as any).__VITE_DEVTOOLS_CLIENT_CONTEXT__
    const sources = await ctx.rpc.call('devframes:plugin:data-inspector:sources')
    return (sources as { id: string }[]).map(s => s.id)
  })
}

// What the user actually gets from the integration: the Data Inspector Nuxt
// DevTools mounts inspects the *live Nuxt app*, and hides the plugin's own demo
// source. We assert that observable contract rather than the dock entry's
// internal registry shape.
test('exposes the live Nuxt application as a data source and hides the demo source', async ({ page, openDevTools }) => {
  await page.goto('/')
  await openDevTools()

  await expect.poll(() => inspectorSources(page), { timeout: 30_000 }).toContain(NUXT_SOURCE_ID)

  const sourceIds = await inspectorSources(page)
  expect(sourceIds).not.toContain(EXAMPLE_SOURCE_ID)

  // Querying the live source returns data (the integration is wired end to end).
  const results = await page.evaluate(async (sourceId) => {
    const ctx = (globalThis as any).__VITE_DEVTOOLS_CLIENT_CONTEXT__
    const nuxt = await ctx.rpc.call('devframes:plugin:data-inspector:query', sourceId, 'nuxt')
    const vite = await ctx.rpc.call('devframes:plugin:data-inspector:query', sourceId, 'vite')
    return { nuxt, vite }
  }, NUXT_SOURCE_ID)

  expect((results.nuxt as { ok: boolean }).ok).toBe(true)
  expect((results.vite as { ok: boolean }).ok).toBe(true)
})
