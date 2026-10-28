import type { FrameLocator, Page } from '@playwright/test'
import { Buffer } from 'node:buffer'
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { expect, test } from '../e2e/fixtures/devtools'

const IMAGES_DIR = fileURLToPath(new URL('../../docs/images/', import.meta.url))

/** Width of the WebP files written to `docs/images/`. */
const IMAGE_WIDTH = 1600

interface Shot {
  /** File name in `docs/images/`, without the extension. */
  name: string
  /** DevTools tab route. */
  tab: string
  /** Puts the tab in the state the docs show, then waits for it. */
  prepare: (frame: FrameLocator, page: Page) => Promise<void>
}

function shows(text: string) {
  return async (frame: FrameLocator) => {
    await frame.getByText(text, { exact: true }).first().waitFor()
  }
}

const SHOTS: Shot[] = [
  {
    name: 'overview',
    tab: '/modules/overview',
    prepare: shows('Nuxt DevTools'),
  },
  {
    name: 'pages',
    tab: '/modules/pages',
    prepare: shows('All Routes'),
  },
  {
    name: 'components',
    tab: '/modules/components',
    prepare: shows('User components'),
  },
  {
    name: 'imports',
    tab: '/modules/imports',
    prepare: shows('User composables'),
  },
  {
    name: 'modules',
    tab: '/modules/modules',
    prepare: shows('Installed Modules'),
  },
  {
    name: 'payload',
    tab: '/modules/payload',
    async prepare(frame) {
      for (const key of ['cart', 'products'])
        await frame.getByRole('button', { name: key, exact: true }).click()
      await frame.getByText('Nuxt T-Shirt').waitFor()
    },
  },
  {
    name: 'runtime-configs',
    tab: '/modules/runtime-configs',
    prepare: shows('Public Runtime Config'),
  },
  {
    name: 'timeline',
    tab: '/modules/timeline',
    async prepare(frame, page) {
      await frame.getByRole('button', { name: 'Start Tracking' }).click()
      for (const path of [
        '/products/1',
        '/about',
        '/products/4',
        '/products',
      ]) {
        await page.evaluate(path => (globalThis as any).__NUXT_DEVTOOLS_HOST__.app.navigate(path), path)
        await page.waitForURL(`**${path}`)
        await page.waitForTimeout(500)
      }
      // The tab only picks up the recorded events when it renders again.
      for (const tab of ['/modules/overview', '/modules/timeline'])
        await page.evaluate(tab => (globalThis as any).__NUXT_DEVTOOLS_HOST__.devtools.navigate(tab), tab)
      await expect(frame.locator('body')).toContainText('/products/4')
    },
  },
  {
    name: 'server-routes',
    tab: '/modules/server-routes',
    async prepare(frame) {
      await frame.getByRole('button', { name: 'GET /api/products', exact: true }).click()
      await frame.getByRole('button', { name: 'Send request' }).click()
      await frame.getByText('Response', { exact: true }).waitFor()
    },
  },
  {
    name: 'server-tasks',
    tab: '/modules/server-tasks',
    async prepare(frame) {
      await frame.getByRole('button', { name: 'products:sync' }).click()
      await frame.getByRole('button', { name: 'Run task' }).click()
      await frame.getByText('Result', { exact: true }).waitFor()
    },
  },
  {
    name: 'storage',
    tab: '/modules/storage',
    async prepare(frame) {
      await frame.getByText('shop', { exact: true }).click()
      // Written by the task run in `server-tasks`.
      await frame.getByRole('button', { name: 'products', exact: true }).click()
      await frame.getByText('Nuxt T-Shirt').first().waitFor()
    },
  },
  {
    name: 'hooks',
    tab: '/modules/hooks',
    prepare: shows('Server Hooks'),
  },
]

/** The Vite DevTools panel and its dock bar, from the shadow root they are mounted in. */
async function panelClip(page: Page) {
  return page.evaluate(() => {
    const root = document.querySelector('devframes-dock-embedded')!.shadowRoot!
    const rects = [
      root.querySelector('#devframes-views-container')!.closest('.bg-dock-glass')!,
      root.querySelector('#devframes-dock')!,
    ].map(el => el.getBoundingClientRect())
    const x = Math.floor(Math.min(...rects.map(r => r.left)))
    const y = Math.floor(Math.min(...rects.map(r => r.top)))
    return {
      x,
      y,
      width: Math.ceil(Math.max(...rects.map(r => r.right))) - x,
      height: Math.ceil(Math.max(...rects.map(r => r.bottom))) - y,
    }
  })
}

/** Chromium encodes the WebP, so the script needs no image dependency. */
async function toWebp(page: Page, png: Buffer): Promise<Buffer> {
  const data = await page.evaluate(async ({ png, width }) => {
    const image = new Image()
    image.src = `data:image/png;base64,${png}`
    await image.decode()
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = Math.round(image.height * width / image.width)
    const context = canvas.getContext('2d')!
    context.imageSmoothingQuality = 'high'
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/webp', 0.85).split(',')[1]!
  }, {
    png: png.toString('base64'),
    width: IMAGE_WIDTH,
  })

  return Buffer.from(data, 'base64')
}

test('docs screenshots', async ({ page, openDevTools, navigateTab, devtoolsFrame }) => {
  // Something in the cart, for the Payload tab; retried until the page has hydrated.
  await page.goto('/products')
  await expect(async () => {
    await page.getByRole('button', { name: 'Add to cart' }).first().click()
    await expect(page.getByText('Cart (0)')).toBeHidden({ timeout: 1000 })
  }).toPass()

  await openDevTools()
  // Only the panel is captured; hide the app so it does not show around the dock bar.
  await page.addStyleTag({ content: '#__nuxt { visibility: hidden }' })

  for (const shot of SHOTS) {
    await test.step(shot.name, async () => {
      await navigateTab(shot.tab)
      await shot.prepare(devtoolsFrame(), page)
      // Tab icons are fetched from the Iconify API; a failed fetch shows a warning icon instead.
      await page.waitForLoadState('networkidle')
      await expect(page.locator('devframes-dock-embedded [class*="warning-duotone"]')).toHaveCount(0)
      // Away from the panel: no hover state in the capture.
      await page.mouse.move(1279, 799)
      await page.waitForTimeout(500)

      const png = await page.screenshot({ clip: await panelClip(page), animations: 'disabled', caret: 'hide' })
      await writeFile(`${IMAGES_DIR}${shot.name}.webp`, await toWebp(page, png))
    })
  }
})
