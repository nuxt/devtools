import { expect, test } from '../fixtures/devtools'

test.skip(
  ({ playground }) => playground !== 'tab-timeline',
  'tab-timeline playground only',
)

test('does not break key injection of keyed composables', async ({ page }) => {
  await page.goto('/keyed')
  await expect(page.getByTestId('counter')).toHaveText('counter: 1')
  await expect(page.getByTestId('data')).toHaveText('async data')
})

test('applies both key injection and timeline wrapping to the module', async ({ page }) => {
  await page.goto('/keyed')
  const res = await page.request.get('/_nuxt/pages/keyed.vue')
  expect(res.ok()).toBe(true)
  const code = await res.text()
  expect(code).toContain('__nuxtTimelineWrap("useState", _$__useState)')
  expect(code).toContain('__nuxtTimelineWrap("callOnce", _$__callOnce)')
  expect(code).toContain('/* nuxt-injected */')
})
