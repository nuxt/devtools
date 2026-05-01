import { spawn } from 'node:child_process'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { matchesProjectFilter } from './shared/glob'

const REPO_ROOT = fileURLToPath(new URL('../..', import.meta.url))

const PLAYGROUNDS = ['empty', 'tab-pinia', 'tab-seo'] as const

function buildPlayground(name: string) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn('pnpm', ['-C', `playgrounds/${name}`, 'exec', 'nuxt', 'build'], {
      cwd: REPO_ROOT,
      stdio: 'inherit',
      env: process.env,
    })
    child.once('error', err => reject(new Error(`Failed to spawn build for ${name}: ${err.message}`)))
    child.once('exit', (code, signal) => {
      if (code === 0)
        resolve()
      else if (signal)
        reject(new Error(`Build failed for ${name}: terminated by ${signal}`))
      else
        reject(new Error(`Build failed for ${name}: exit code ${code}`))
    })
  })
}

export default async function globalSetup() {
  // Pre-build playgrounds whose `built` projects will be tested.
  // Without this, six webServers (3 dev + 3 build+preview) booting in parallel
  // overwhelms the timeout. Pre-building serially is faster and more reliable.
  if (process.env.PW_SKIP_BUILD === 'true')
    return

  const filter = process.env.PW_PROJECT
  for (const name of PLAYGROUNDS) {
    if (!matchesProjectFilter(`${name}:built`, filter))
      continue
    // eslint-disable-next-line no-console
    console.log(`[e2e] Pre-building ${name}...`)
    await buildPlayground(name)
  }
}
