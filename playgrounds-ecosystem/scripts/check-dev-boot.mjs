/**
 * Boot a playground's `nuxt dev`, wait until the app answers, assert the
 * embedded DevTools client is served too, then shut the server down.
 *
 * Nuxt DevTools only does anything in dev mode, so `nuxt build` passing says
 * nothing about it. This is the cheapest signal CI can get that DevTools
 * actually starts on a given Nuxt major.
 *
 *   node playgrounds-ecosystem/scripts/check-dev-boot.mjs playgrounds-ecosystem/nuxt4
 */
import { spawn } from 'node:child_process'
import process from 'node:process'
import { setTimeout as sleep } from 'node:timers/promises'

const [playground] = process.argv.slice(2)
if (!playground) {
  console.error('usage: check-dev-boot.mjs <playground-dir>')
  process.exit(2)
}

const PORT = Number(process.env.PORT ?? 13400)
const TIMEOUT_MS = 180_000
const CLIENT_PATH = '/__nuxt_devtools__/client/'

// Own process group, so the whole pnpm → nuxt tree can be killed at the end.
const server = spawn('pnpm', ['exec', 'nuxt', 'dev', '--port', String(PORT)], {
  cwd: playground,
  stdio: ['ignore', 'pipe', 'pipe'],
  detached: true,
  env: { ...process.env, VITE_DEVTOOLS_DISABLE_CLIENT_AUTH: 'true' },
})
let output = ''
server.stdout.on('data', d => output += d)
server.stderr.on('data', d => output += d)

async function status(path) {
  try {
    const res = await fetch(`http://localhost:${PORT}${path}`)
    return res.status
  }
  catch {
    return 0
  }
}

async function waitFor(path, deadline) {
  while (Date.now() < deadline) {
    if (server.exitCode !== null)
      throw new Error(`dev server exited early with code ${server.exitCode}`)
    const code = await status(path)
    if (code === 200)
      return
    await sleep(1000)
  }
  throw new Error(`timed out waiting for ${path} to answer 200`)
}

try {
  const deadline = Date.now() + TIMEOUT_MS
  await waitFor('/', deadline)
  await waitFor(CLIENT_PATH, deadline)
  console.log(`✓ ${playground}: app and DevTools client answer on :${PORT}`)
}
catch (error) {
  console.error(`✗ ${playground}: ${error.message}\n\n--- dev server output ---\n${output}`)
  process.exitCode = 1
}
finally {
  process.kill(-server.pid, 'SIGTERM')
  await sleep(2000)
  try {
    process.kill(-server.pid, 'SIGKILL')
  }
  catch {}
  server.stdout.destroy()
  server.stderr.destroy()
}
