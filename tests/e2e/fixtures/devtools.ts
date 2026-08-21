import type { FrameLocator, Page } from '@playwright/test'
import { test as base, expect } from '@playwright/test'

// The Nuxt DevTools client renders inside an iframe that Vite DevTools mounts in
// its own shadow DOM. The iframe has no stable id, so we target it by src.
const IFRAME_SELECTOR = 'iframe[src*="__nuxt_devtools__/client"]'

interface DevToolsFixtures {
  playground: string
  mode: 'dev' | 'built'
  /** Open the DevTools panel and wait for the client app to hydrate. */
  openDevTools: () => Promise<void>
  /** Navigate the open DevTools client to a tab route (e.g. `/modules/modules`). */
  navigateTab: (path: string) => Promise<void>
  /** Locator scoped to the DevTools client iframe. */
  devtoolsFrame: () => FrameLocator
}

// e2e servers run with `VITE_DEVTOOLS_DISABLE_CLIENT_AUTH=true`, which trusts the
// *server* peer (so RPC is allowed), but the client can still initialize before
// that state is reflected locally. Complete the handshake through Devframe's
// public API before waiting for docks. This is purely test-environment plumbing;
// it is not something the tests assert on.
async function ensureDockReady(page: Page): Promise<void> {
  await page.waitForFunction(
    () => Boolean((globalThis as any).__NUXT_DEVTOOLS_HOST__?.devtools),
    null,
    { timeout: 30_000 },
  )
  await page.waitForFunction(
    () => Boolean((globalThis as any).__DEVFRAME_HUB_CLIENT_CONTEXT__?.rpc),
    null,
    { timeout: 30_000 },
  )
  await page.evaluate(async () => {
    const rpc = (globalThis as any).__DEVFRAME_HUB_CLIENT_CONTEXT__?.rpc
    if (rpc && !rpc.isTrusted)
      await rpc.requestTrust()
  })
  await page.waitForFunction(
    () => Boolean((globalThis as any).__DEVFRAME_HUB_CLIENT_CONTEXT__?.rpc?.isTrusted),
    null,
    { timeout: 30_000 },
  )
  await page.waitForFunction(
    () => Boolean((globalThis as any).__DEVFRAME_HUB_CLIENT_CONTEXT__?.docks?.entries?.length),
    null,
    { timeout: 30_000 },
  )
}

export const test = base.extend<DevToolsFixtures>({
  // eslint-disable-next-line no-empty-pattern
  playground: async ({}, use, info) => {
    await use(info.project.metadata.playground)
  },
  // eslint-disable-next-line no-empty-pattern
  mode: async ({}, use, info) => {
    await use(info.project.metadata.mode)
  },

  openDevTools: async ({ page }, use) => {
    await use(async () => {
      await ensureDockReady(page)
      // Drive the *public* host API the same way the keyboard shortcut / host app
      // would — no reaching into Vite DevTools' internal panel/dock state.
      await page.evaluate(() => (globalThis as any).__NUXT_DEVTOOLS_HOST__.devtools.open())
      // Wait for the client app inside the iframe to hydrate.
      await page.frameLocator(IFRAME_SELECTOR)
        .locator('#nuxt-devtools-app')
        .waitFor({ state: 'attached', timeout: 60_000 })
    })
  },

  navigateTab: async ({ page }, use) => {
    await use(async (path: string) => {
      // Navigate via the documented host API (`devtools.navigate`) rather than
      // poking the frame-nav hook or router directly.
      await page.evaluate(
        p => (globalThis as any).__NUXT_DEVTOOLS_HOST__.devtools.navigate(p),
        path,
      )
    })
  },

  devtoolsFrame: async ({ page }, use) => {
    await use(() => page.frameLocator(IFRAME_SELECTOR))
  },
})

export { expect }
