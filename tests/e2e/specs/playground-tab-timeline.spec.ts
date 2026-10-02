import { expect, test } from '../fixtures/devtools'

test.skip(
  ({ playground }) => playground !== 'tab-timeline',
  'tab-timeline playground only',
)

test('does not break key injection of keyed composables', async ({ page }) => {
  await page.goto('/keyed')
  await expect(page.getByTestId('counter')).toHaveText('counter: 1')
  await expect(page.getByTestId('data')).toHaveText('async data')
  // `useApiData` is created by the `createUseFetch` compiler macro (nuxt/nuxt#34934)
  await expect(page.getByTestId('api')).toHaveText('Hello timeline')
})

test('applies both key injection and timeline wrapping to the module', async ({ page }) => {
  await page.goto('/keyed')
  const res = await page.request.get('/_nuxt/pages/keyed.vue')
  expect(res.ok()).toBe(true)
  const code = await res.text()
  for (const fn of ['useState', 'callOnce', 'useAsyncData', 'useApiData'])
    expect(code).toContain(`__nuxtTimelineWrap("${fn}", _$__${fn})`)
  // one injected key per keyed call above
  expect(code.match(/\/\* nuxt-injected \*\//g)).toHaveLength(4)
})

test('leaves keyed function factory macros unwrapped', async ({ page }) => {
  await page.goto('/keyed')
  const res = await page.request.get('/_nuxt/composables/useApiData.ts')
  expect(res.ok()).toBe(true)
  const code = await res.text()
  expect(code).toContain('createUseFetch.__nuxt_factory(')
  expect(code).not.toContain('__nuxtTimelineWrap("createUseFetch"')
})
