import { expect, test } from '@playwright/test'

test('DevTools renders', async ({ page }) => {
  await page.goto('./', { waitUntil: 'networkidle' })

  await page.waitForTimeout(2000) // TODO: A smarter wait for loading state

  // Expect a heading to be visible (using this as a smoke test)
  const welcome = await page.getByRole('heading', { name: 'Nuxt DevTools Welcome' })
  expect(welcome).toBeVisible()

  const getStarted = await page.getByRole('link', { name: 'Get Started' })
  expect(getStarted).toBeVisible()

  await getStarted.click()
})
