import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { defineConfig, devices } from '@playwright/test'

// Opt-in smoke suite for the ecosystem dogfooding playground
// (`../modules`). Deliberately NOT wired into the repo's main
// `tests/e2e/playwright.config.ts` — the ecosystem workspace is sealed off
// with its own lockfile and is not part of the default install/CI path (see
// ../README.md). Run it explicitly, after the ecosystem workspace is
// installed and this repo's devtools client is built:
//
//   pnpm install                                   # repo root
//   pnpm run build                                 # real static devtools client
//   pnpm -C playgrounds-ecosystem/modules install  # sealed workspace
//   pnpm exec playwright test \
//     --config playgrounds-ecosystem/tests/playwright.config.ts
//
// Like the main e2e suite (and unlike hand-dogfooding with
// `NUXT_DEVTOOLS_LOCAL=true`), this boots the app against the BUILT
// `@nuxt/devtools` static client — no `../../local` dev subprocess, which the
// e2e workflow notes doesn't reliably finish on cold runners.
const REPO_ROOT = fileURLToPath(new URL('../..', import.meta.url))
const PORT = Number(process.env.PW_ECOSYSTEM_PORT ?? 13200)

export default defineConfig({
  testDir: '.',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  // This combined app compiles a lot of modules on first load, so the very
  // first devtools boot is slow; two retries absorb cold-start flake.
  retries: 2,
  reporter: process.env.CI
    ? [['list'], ['github'], ['html', { open: 'never', outputFolder: 'playwright-report' }]]
    : 'list',
  timeout: 120_000,
  use: {
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'ecosystem:dev',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: `http://localhost:${PORT}`,
      },
      // The shared devtools fixture reads these; only `mode` matters here.
      metadata: { playground: 'ecosystem', mode: 'dev' },
    },
  ],
  webServer: {
    command: `pnpm -C playgrounds-ecosystem/modules exec nuxt dev --port ${PORT}`,
    cwd: REPO_ROOT,
    // TCP-level readiness check (see the main e2e config for the rationale).
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    stdout: 'pipe',
    stderr: 'pipe',
    env: {
      // For e2e we spawn an ephemeral server, so let any browser connect
      // without the per-client Vite DevTools trust prompt.
      VITE_DEVTOOLS_DISABLE_CLIENT_AUTH: 'true',
      // Bind the app server to all interfaces so `localhost` resolves on every platform.
      HOST: '0.0.0.0',
    },
  },
})
