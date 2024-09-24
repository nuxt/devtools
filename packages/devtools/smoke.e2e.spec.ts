import { expect, test } from '@playwright/test'

test('DevTools renders', async ({ page }) => {
  await page.goto('/')

  // Expect a heading to be visible (using this as a smoke test)
  const heading = await page.getByRole('heading', { name: 'Nuxt DevTools' })
  expect(heading).toBeVisible()
})
