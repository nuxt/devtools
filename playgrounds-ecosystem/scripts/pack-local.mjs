// @ts-check
/**
 * Build this repo's DevTools packages and pack them into local tarballs that the
 * per-major playgrounds (`../nuxt4`, `../nuxt5`) install — the same artifacts npm
 * would serve, so each playground exercises the real user install path from
 * `dist` rather than a `workspace:`/`link:` alias to source.
 *
 * `pnpm pack` rewrites each package's `workspace:*` and `catalog:*` protocols
 * into concrete versions, so the tarballs are exactly what end users receive.
 * Each playground's `pnpm-workspace.yaml` then points `@nuxt/devtools` and its
 * inter-package `@nuxt/devtools-kit` dependency at these tarballs via
 * `overrides`, and resolves everything else from the registry — a faithful,
 * SEALED install (own lockfile) where DevTools + the app share one node_modules
 * (hence one Vite / `@vitejs/devtools` instance, which `nuxi dev` needs).
 *
 * The tarballs are copied INTO each playground's own `.tarballs/` (referenced as
 * `file:.tarballs/*.tgz`), so nothing points outside the sealed workspace root.
 *
 * Usage (from a playground, via its `setup` script, or standalone):
 *   node ../scripts/pack-local.mjs            # build the monorepo, then pack
 *   node ../scripts/pack-local.mjs --no-build # skip the build, just (re)pack dist
 */
import { execSync } from 'node:child_process'
import { copyFileSync, mkdirSync, readdirSync, renameSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const ecosystemDir = resolve(scriptDir, '..')
const repoRoot = resolve(ecosystemDir, '..')
const stagingDir = join(ecosystemDir, '.tarballs-staging')

/** Playgrounds that install the packed tarballs (each gets its own `.tarballs/`). */
const PLAYGROUNDS = ['nuxt4', 'nuxt5']

/**
 * The published DevTools packages the playgrounds consume. `@nuxt/devtools`
 * depends on `@nuxt/devtools-kit` (via `workspace:*`), so both must be packed
 * and overridden together. `@nuxt/devtools-ui-kit` is not a dependency of
 * either, so it isn't packed.
 *
 * @type {Array<{ name: string, dir: string, out: string }>}
 */
const PACKAGES = [
  { name: '@nuxt/devtools', dir: 'packages/devtools', out: 'nuxt-devtools.tgz' },
  { name: '@nuxt/devtools-kit', dir: 'packages/devtools-kit', out: 'nuxt-devtools-kit.tgz' },
]

const skipBuild = process.argv.includes('--no-build')

/** @param {string} cmd @param {string} cwd */
function run(cmd, cwd) {
  console.log(`\n$ ${cmd}\n  (cwd: ${cwd})`)
  execSync(cmd, { cwd, stdio: 'inherit' })
}

if (!skipBuild)
  run('pnpm build', repoRoot)

rmSync(stagingDir, { recursive: true, force: true })
mkdirSync(stagingDir, { recursive: true })

// `--config.ignore-scripts=true` skips each package's `prepack` rebuild, since
// the monorepo build above already produced fresh `dist` output.
for (const { name, dir } of PACKAGES) {
  console.log(`\nPacking ${name}...`)
  run(`pnpm pack --config.ignore-scripts=true --pack-destination "${stagingDir}"`, join(repoRoot, dir))
}

// pnpm writes `<name>-<version>.tgz`; rename to the stable, version-agnostic
// names the playgrounds' `pnpm-workspace.yaml` overrides reference, then copy
// into each playground's own `.tarballs/`.
const produced = readdirSync(stagingDir)
for (const { name, out } of PACKAGES) {
  const base = name.replace('@', '').replace('/', '-')
  const pattern = new RegExp(`^${base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-\\d[^/]*\\.tgz$`)
  const match = produced.find(f => pattern.test(f))
  if (!match)
    throw new Error(`Could not find packed tarball for ${name} (expected ${base}-<version>.tgz)`)
  renameSync(join(stagingDir, match), join(stagingDir, out))
}

for (const playground of PLAYGROUNDS) {
  const dest = join(ecosystemDir, playground, '.tarballs')
  rmSync(dest, { recursive: true, force: true })
  mkdirSync(dest, { recursive: true })
  for (const { name, out } of PACKAGES) {
    copyFileSync(join(stagingDir, out), join(dest, out))
    console.log(`✓ ${name} -> ${playground}/.tarballs/${out}`)
  }
}

rmSync(stagingDir, { recursive: true, force: true })

console.log('\nDone. Now run: pnpm install --no-frozen-lockfile')
