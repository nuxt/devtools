import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { defineConfig, devices } from '@playwright/test'
import { matchesProjectFilter } from './shared/glob'

const REPO_ROOT = fileURLToPath(new URL('../..', import.meta.url))

const PLAYGROUNDS = ['empty', 'tab-pinia', 'tab-seo'] as const
const MODES = ['dev', 'built'] as const

type Mode = typeof MODES[number]
type Playground = typeof PLAYGROUNDS[number]

interface Spec {
  name: string
  playground: Playground
  mode: Mode
  port: number
}

const allSpecs: Spec[] = PLAYGROUNDS.flatMap((playground, idx) =>
  MODES.map((mode): Spec => ({
    name: `${playground}:${mode}`,
    playground,
    mode,
    port: 13000 + idx * 10 + (mode === 'dev' ? 0 : 1),
  })),
)

// PW_PROJECT supports glob-style filtering (e.g. `*:dev`, `empty:*`, `empty:dev`).
// Used by the npm scripts to avoid booting all 6 servers when only one mode is needed.
// Falls back to all specs when unset.
const filter = process.env.PW_PROJECT
const specs = allSpecs.filter(s => matchesProjectFilter(s.name, filter))

export default defineConfig({
  testDir: './specs',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  // First iframe test for `../../local` playgrounds (tab-pinia, tab-seo) can flake
  // on cold subprocess boot; one retry covers it.
  retries: 1,
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
  webServer: specs.map((s) => {
    const target = `playgrounds/${s.playground}`
    // Builds happen in globalSetup; webServer here only spawns dev or preview,
    // both of which boot in seconds.
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
        // Vite DevTools requires per-client trust by default. For e2e we're spawning
        // ephemeral servers, so disable auth — any browser may connect.
        VITE_DEVTOOLS_DISABLE_CLIENT_AUTH: 'true',
        // Bind the main app server to all interfaces. Default `nuxt dev`/`preview`
        // on macOS binds only to IPv6, so 127.0.0.1 requests get refused. We use
        // `localhost` baseURL above to match the Vite DevTools websocket bind.
        HOST: '0.0.0.0',
      },
    }
  }),
})
