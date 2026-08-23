// Reproducible check for how `@nuxt/devtools`'s optional-peer Nitro types
// resolve when a consumer has only ONE of `nitropack` (Nitro v2, Nuxt 4) or
// `nitro` (Nitro v3, Nuxt 5) installed — the scenario the sibling `nuxt4/` and
// `nuxt5/` playgrounds can't isolate at the type level (their `link:`ed local
// `@nuxt/devtools` makes Nuxt add tsconfig `paths` for BOTH engines).
//
// It reproduces, in throwaway temp dirs, exactly what a published-npm consumer
// sees: the detection lives in a `.d.ts` (so `skipLibCheck` turns the absent
// engine's `import type` into `any`), and only one engine is symlinked in.
//
// Asserts:
//   - only `nitro`    → `AnyNitro` resolves to the concrete Nitro v3 type
//   - only `nitropack`→ `AnyNitro` resolves to the concrete Nitro v2 type
//   - a naive `NitroV2 | NitroV3` union instead collapses to `any` (the reason
//     the shipped detection is necessary)
//
// Run from the repo root after `pnpm install`:
//   node playgrounds-ecosystem/scripts/check-nitro-type-resolution.mjs

import { execFileSync } from 'node:child_process'
import { existsSync, globSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const pnpmDir = join(repoRoot, 'node_modules/.pnpm')
const tsc = join(repoRoot, 'node_modules/.bin/tsc')
// Must live OUTSIDE the repo: a temp dir nested under the repo would let
// TypeScript resolve the "absent" engine by walking up to the repo's own
// node_modules, defeating the single-engine simulation.
const tmpRoot = mkdtempSync(join(tmpdir(), 'nitro-type-resolution-'))

function findPkg(glob) {
  const [match] = globSync(glob, { cwd: pnpmDir }).sort()
  if (!match)
    throw new Error(`Could not find ${glob} under ${pnpmDir} — run \`pnpm install\` first.`)
  return join(pnpmDir, match)
}

const nitropackDir = findPkg('nitropack@2*/node_modules/nitropack')
const nitroDir = findPkg('nitro@3*/node_modules/nitro')

// The detection shipped in packages/*/src/**/nitro-compat.ts, as a `.d.ts`.
const COMPAT = `import type { Nitro as NitroV3 } from 'nitro/types'
import type { Nitro as NitroV2 } from 'nitropack'
export type HasNitroV2 = 'options' extends keyof NitroV2 ? ('___INVALID' extends keyof NitroV2 ? false : true) : false
export type HasNitroV3 = 'options' extends keyof NitroV3 ? ('___INVALID' extends keyof NitroV3 ? false : true) : false
export type AnyNitro = HasNitroV2 extends true ? (HasNitroV3 extends true ? NitroV2 | NitroV3 : NitroV2) : NitroV3
export type NaiveAnyNitro = NitroV2 | NitroV3
`

const TSCONFIG = JSON.stringify({
  compilerOptions: {
    strict: true,
    skipLibCheck: true,
    noEmit: true,
    moduleResolution: 'bundler',
    module: 'esnext',
    types: [],
  },
  files: ['check.ts'],
})

const HELPERS = `type IsAny<T> = 0 extends (1 & T) ? true : false
type Expect<T extends true> = T
`

/**
 * @param {string} name
 * @param {Array<[pkgName: string, pkgDir: string]>} links
 * @param {string} body
 */
function runScenario(name, links, body) {
  const dir = join(tmpRoot, name)
  rmSync(dir, { recursive: true, force: true })
  mkdirSync(join(dir, 'node_modules'), { recursive: true })
  for (const [pkgName, pkgDir] of links)
    symlinkSync(pkgDir, join(dir, 'node_modules', pkgName))
  writeFileSync(join(dir, 'nitro-compat.d.ts'), COMPAT)
  writeFileSync(join(dir, 'tsconfig.json'), TSCONFIG)
  writeFileSync(join(dir, 'check.ts'), HELPERS + body)
  try {
    execFileSync(tsc, ['-p', 'tsconfig.json'], { cwd: dir, stdio: 'pipe' })
    return { ok: true, output: '' }
  }
  catch (err) {
    return { ok: false, output: `${err.stdout || ''}${err.stderr || ''}` }
  }
}

const scenarios = [
  {
    title: 'only `nitro` (v3) installed → AnyNitro is the concrete Nitro v3 type',
    links: [['nitro', nitroDir]],
    body: `import type { AnyNitro, HasNitroV2, HasNitroV3 } from './nitro-compat'
export type _V2Absent = Expect<HasNitroV2 extends false ? true : false>
export type _V3Present = Expect<HasNitroV3 extends true ? true : false>
export type _NotAny = Expect<IsAny<AnyNitro> extends true ? false : true>
declare const n: AnyNitro
export const _options = n.options
`,
    expectPass: true,
  },
  {
    title: 'only `nitropack` (v2) installed → AnyNitro is the concrete Nitro v2 type',
    links: [['nitropack', nitropackDir]],
    body: `import type { AnyNitro, HasNitroV2, HasNitroV3 } from './nitro-compat'
export type _V2Present = Expect<HasNitroV2 extends true ? true : false>
export type _V3Absent = Expect<HasNitroV3 extends false ? true : false>
export type _NotAny = Expect<IsAny<AnyNitro> extends true ? false : true>
declare const n: AnyNitro
export const _options = n.options
`,
    expectPass: true,
  },
  {
    title: 'control: naive `NitroV2 | NitroV3` union collapses to `any` when v3 absent',
    links: [['nitropack', nitropackDir]],
    body: `import type { NaiveAnyNitro } from './nitro-compat'
// Expect IsAny = true — this is the failure mode the shipped detection avoids.
export type _IsAny = Expect<IsAny<NaiveAnyNitro> extends true ? true : false>
`,
    expectPass: true,
  },
]

if (!existsSync(tsc))
  throw new Error(`tsc not found at ${tsc} — run \`pnpm install\` at the repo root first.`)

let failed = 0
for (const s of scenarios) {
  const { ok, output } = runScenario(s.title.slice(0, 24).replace(/\W+/g, '-'), s.links, s.body)
  const pass = ok === s.expectPass
  console.log(`${pass ? '✓' : '✗'} ${s.title}`)
  if (!pass) {
    failed++
    console.log(output.split('\n').map(l => `    ${l}`).join('\n'))
  }
}
rmSync(tmpRoot, { recursive: true, force: true })

if (failed) {
  console.error(`\n${failed} nitro type-resolution assertion(s) failed.`)
  process.exit(1)
}
console.log('\nAll nitro type-resolution assertions passed.')
