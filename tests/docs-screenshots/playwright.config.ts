import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { defineConfig, devices } from '@playwright/test'

const REPO_ROOT = fileURLToPath(new URL('../..', import.meta.url))
const PORT = 13200

/**
 * Regenerates the screenshots in `docs/images/` from `playgrounds/docs`: `pnpm docs:screenshots`.
 * Not part of the e2e suite: it writes files instead of asserting.
 */
export default defineConfig({
  testDir: '.',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  // A cold dev server can fail the first Iconify fetches; a retry starts from a warm one.
  retries: 1,
  timeout: 120_000,
  use: {
    ...devices['Desktop Chrome'],
    baseURL: `http://localhost:${PORT}`,
    // The panel opens at 80% of the viewport: 1024×640, captured at 2x.
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
    colorScheme: 'dark',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'docs',
      // Read by the e2e fixtures.
      metadata: { playground: 'docs', mode: 'dev' },
    },
  ],
  webServer: {
    command: `pnpm -C playgrounds/docs exec nuxt dev --port ${PORT}`,
    cwd: REPO_ROOT,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      // Ephemeral server: skip the browser authorization prompt.
      VITE_DEVTOOLS_DISABLE_CLIENT_AUTH: 'true',
      HOST: '0.0.0.0',
    },
  },
})
