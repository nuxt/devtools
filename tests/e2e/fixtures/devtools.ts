import type { FrameLocator } from '@playwright/test'
import { test as base, expect } from '@playwright/test'

// Vite DevTools renders the Nuxt DevTools dock entry as an iframe nested inside its
// own shadow DOM. The iframe has no stable id, so we target by src.
const IFRAME_SELECTOR = 'iframe[src*="__nuxt_devtools__/client"]'

interface DevToolsFixtures {
  playground: string
  mode: 'dev' | 'built'
  openDevTools: () => Promise<void>
  navigateTab: (path: string) => Promise<void>
  devtoolsFrame: () => FrameLocator
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

  // Skip the DevTools welcome page on every navigation. Without this,
  // SideNav is hidden because the route middleware keeps the user on `/`
  // until they click "Get started".
  page: async ({ page }, use) => {
    await page.addInitScript(() => {
      try {
        localStorage.setItem('nuxt-devtools-first-visit', 'false')
      }
      catch {
        // Ignore — older sandboxes may block storage on initial nav.
      }
    })
    await use(page)
  },

  openDevTools: async ({ page }, use) => {
    await use(async () => {
      await page.waitForFunction(
        () => Boolean((globalThis as any).__VITE_DEVTOOLS_CLIENT_CONTEXT__?.docks?.entries?.length),
        null,
        { timeout: 30_000 },
      )
      // Drive Vite DevTools directly: open the panel, then switch the active
      // dock entry to nuxt:devtools (idempotent; safe to call when already open).
      await page.evaluate(async () => {
        const ctx = (globalThis as any).__VITE_DEVTOOLS_CLIENT_CONTEXT__
        ctx.panel.store.open = true
        await ctx.docks.switchEntry('nuxt:devtools')
      })
      // Iframe creation is async after switchEntry resolves. Poll the dock entry
      // state until its DOM iframe is attached.
      await page.waitForFunction(() => {
        const ctx = (globalThis as any).__VITE_DEVTOOLS_CLIENT_CONTEXT__
        const state = ctx?.docks?.getStateById?.('nuxt:devtools')
        return Boolean(state?.domElements?.iframe?.isConnected)
      }, null, { timeout: 30_000 })
      // Then wait for the inner app to hydrate. Generous timeout: playgrounds that
      // use `../../local` spawn a separate Nuxt dev subprocess for the devtools
      // client, and its first Vite compile is slow on cold start.
      await page.frameLocator(IFRAME_SELECTOR).locator('#nuxt-devtools-side-nav').waitFor({ state: 'attached', timeout: 90_000 })
    })
  },

  navigateTab: async ({ page }, use) => {
    await use(async (path: string) => {
      // Drive navigation through the documented host hook.
      // (`__NUXT_DEVTOOLS_HOST__.devtools.navigate` itself currently writes to
      // `ctx.panel.store.value.open`, which assumes a Vue ref but the kit exposes
      // a plain object — using the hook avoids that landmine.)
      await page.evaluate(
        p => (window as any).__NUXT_DEVTOOLS_HOST__.hooks.callHook('host:action:navigate', p),
        path,
      )
    })
  },

  devtoolsFrame: async ({ page }, use) => {
    await use(() => page.frameLocator(IFRAME_SELECTOR))
  },
})

export { expect }
