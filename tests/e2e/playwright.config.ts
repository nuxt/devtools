import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { defineConfig, devices } from '@playwright/test'
import { matchesProjectFilter } from './shared/glob'

const REPO_ROOT = fileURLToPath(new URL('../..', import.meta.url))

const PLAYGROUNDS = ['empty', 'spa', 'tab-pinia', 'tab-seo'] as const
const MODES = ['dev', 'built'] as const

type Mode = typeof MODES[number]
type Playground = typeof PLAYGROUNDS[number]

// Dev mode exercises the DevTools UI on every playground. Built (production
// preview) mode only checks the app still renders — Nuxt DevTools no-ops
// outside dev — so we run it on just the two distinct rendering targets:
// `empty` (SSR) and `spa` (ssr:false). Building `tab-pinia`/`tab-seo` too, only
// to load a page, is wasted time (and `tab-seo`'s prod build has a known
// auto-import bug). `tab-pinia`/`tab-seo` are therefore dev-only playgrounds.
const BUILT_PLAYGROUNDS = new Set<Playground>(['empty', 'spa'])

interface Spec {
  name: string
  playground: Playground
  mode: Mode
  port: number
}

const allSpecs: Spec[] = PLAYGROUNDS.flatMap((playground, idx) =>
  MODES
    .filter(mode => mode === 'dev' || BUILT_PLAYGROUNDS.has(playground))
    .map((mode): Spec => ({
      name: `${playground}:${mode}`,
      playground,
      mode,
      port: 13000 + idx * 10 + (mode === 'dev' ? 0 : 1),
    })),
)

// PW_PROJECT supports glob-style filtering (e.g. `*:dev`, `empty:*`, `empty:dev`).
// Used by the npm scripts to avoid booting every server when only one mode is
// needed. Falls back to all specs when unset.
const filter = process.env.PW_PROJECT
const specs = allSpecs.filter(s => matchesProjectFilter(s.name, filter))

export default defineConfig({
  testDir: './specs',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  // The client SPA's first Vite compile is slow on a cold server; one retry
  // absorbs that startup flake without masking real, reproducible failures.
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [['list'], ['github'], ['html', { open: 'never', outputFolder: 'playwright-report' }]]
    : 'list',
  timeout: 90_000,
  use: {
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },
  projects: specs.map(s => ({
    name: s.name,
    use: {
      ...devices['Desktop Chrome'],
      baseURL: `http://localhost:${s.port}`,
    },
    metadata: { playground: s.playground, mode: s.mode },
  })),
  // Production builds are done once, up front, by `pnpm test:e2e:prebuild`
  // (see package.json). The servers below only spawn `dev`/`preview`, which
  // boot in seconds.
  webServer: specs.map((s) => {
    const target = `playgrounds/${s.playground}`
    const command = s.mode === 'dev'
      ? `pnpm -C ${target} exec nuxt dev --port ${s.port}`
      : `pnpm -C ${target} exec nuxt preview --port ${s.port}`
    return {
      command,
      cwd: REPO_ROOT,
      // TCP-level readiness check: `port` instead of `url`. Playwright's `url`
      // polling rejects 5xx responses, but some playgrounds' production builds
      // currently return 500 (e.g. `useNuxtDevTools is not defined`). The tests
      // themselves will surface the 500 — we just need the server bound.
      port: s.port,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      stdout: 'pipe' as const,
      stderr: 'pipe' as const,
      env: {
        // Vite DevTools requires per-client trust by default. For e2e we're
        // spawning ephemeral servers, so disable auth — any browser may connect.
        VITE_DEVTOOLS_DISABLE_CLIENT_AUTH: 'true',
        // Bind the app server to all interfaces. Default `nuxt dev`/`preview`
        // on macOS binds only to IPv6, so 127.0.0.1 requests get refused. We use
        // a `localhost` baseURL above to match the Vite DevTools websocket bind.
        HOST: '0.0.0.0',
        ...(s.playground === 'empty'
          ? { NUXT_DEVTOOLS_CODE_SERVER_BIN: 'nuxt-devtools-e2e-missing-code-server' }
          : {}),
      },
    }
  }),
})
