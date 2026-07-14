# Plan 001: Establish a Vitest unit-test baseline for the monorepo

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat c75c3b9..HEAD -- package.json pnpm-workspace.yaml`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: tests / dx
- **Planned at**: commit `c75c3b9`, 2026-07-14

## Why this matters

`pnpm test` currently runs **only** `pnpm lint` (`package.json:16`), and the
`release` script gates on that lint-only `test` (`package.json:15`). There is no
way to execute any of the ~16.8K LOC of server logic and assert it behaves
correctly — the sole "test" file asserts `expect(1 + 2).toBe(3)`. Several later
plans (003, 004, 005) fix bugs in code that reads, writes, and deletes files in
the user's project; those fixes are far safer to land test-first. This plan wires
up a real unit-test runner so every later plan can add a failing test, then make
it pass. Vitest is already available in the workspace catalog — it just isn't
wired in at the root.

## Current state

- `package.json` (repo root) — scripts and devDependencies. Current excerpt:
  ```jsonc
  // package.json:11-27 (scripts)
  "scripts": {
    "build": "turbo run build",
    "dev": "pnpm run build && pnpm -C packages/devtools dev",
    "lint": "eslint --cache .",
    "release": "pnpm test && bumpp -r --all",
    "test": "pnpm lint",
    ...
    "typecheck": "vue-tsc --noEmit",
    ...
  }
  ```
  There is **no** `test:unit` script and **no** `vitest` in root `devDependencies`.
- `pnpm-workspace.yaml` — already lists `vitest: ^4.1.10` and `@vitest/ui: ^4.1.10`
  in the `cli` catalog (lines 81 and 95). So `"vitest": "catalog:cli"` resolves.
  ```yaml
  # pnpm-workspace.yaml (catalogs.cli, excerpt)
  '@vitest/ui': ^4.1.10
  ...
  vitest: ^4.1.10
  ```
- There is **no** `vitest.config.*` or `vite.config.*` anywhere in the repo (verified).
- A pure, dependency-free, exported function exists that is ideal as the first
  real test target — `toJsLiteral` in `packages/devtools/src/utils/serialize-js-literal.ts`:
  ```ts
  // packages/devtools/src/utils/serialize-js-literal.ts:3
  export function toJsLiteral(value: any, seen = new Set()): string { ... }
  // returns 'null' for null, 'undefined' for undefined, String(n) for numbers,
  // JSON.stringify(s) for strings, and `{ key: value }` / `[a, b]` for objects/arrays.
  ```
- Existing placeholder to remove: `packages/devtools/client/tests/basic.test.ts`
  contains only `it('basic', ...) => expect(1 + 2).toBe(3)`.
- Repo conventions: ESM (`"type": "module"`), antfu ESLint config
  (`eslint.config.mjs`), `catalog:` dependency references resolved by pnpm.

## Commands you will need

| Purpose         | Command                          | Expected on success              |
|-----------------|----------------------------------|----------------------------------|
| Install         | `pnpm install`                   | exit 0                           |
| Run unit tests  | `pnpm test:unit`                 | exit 0, tests pass               |
| Lint            | `pnpm lint`                      | exit 0                           |
| Lint (autofix)  | `pnpm lint --fix`                | exit 0                           |

(`pnpm typecheck` requires generated files from `pnpm prepare`/`pnpm build` and is
NOT needed for this plan — do not run it here.)

## Scope

**In scope** (the only files you should create/modify):
- `vitest.config.ts` (create, repo root)
- `package.json` (repo root — add `vitest` devDep + `test:unit` script, update `test`)
- `packages/devtools/test/serialize-js-literal.test.ts` (create)
- `packages/devtools/client/tests/basic.test.ts` (delete the placeholder)

**Out of scope** (do NOT touch):
- `pnpm-workspace.yaml` — the catalog entry already exists; do not edit it.
- Any `packages/*/src/**` source file — this plan adds tests only, changes no logic.
- `.github/workflows/**` — wiring unit tests into CI is a follow-up (see Maintenance notes).
- The Playwright e2e suite under `tests/e2e/**`.
- The `release` script line — leave `"release": "pnpm test && bumpp -r --all"` as-is.

## Git workflow

- Branch: `test/001-vitest-baseline` created off the base branch.
- Conventional Commits (repo uses them — e.g. `chore: update deps`, `fix(devtools): ...`).
  Suggested message: `test: add vitest unit-test baseline`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Add the Vitest config at the repo root

Create `vitest.config.ts` with a project setup that discovers unit tests in the
packages while excluding build output, the Nuxt client app internals, and the
Playwright e2e directory:

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['packages/**/test/**/*.test.ts', 'packages/**/*.spec.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.nuxt/**',
      'tests/e2e/**',
      'packages/devtools/client/**',
    ],
  },
})
```

**Verify**: `test -f vitest.config.ts && echo OK` → prints `OK`.

### Step 2: Add `vitest` to root devDependencies and add the `test:unit` script

In `package.json`:
- Add to `devDependencies` (keep alphabetical order among the `v*` entries):
  `"vitest": "catalog:cli"`.
- Add a `test:unit` script and make the aggregate `test` run lint **and** the unit
  suite. Change:
  ```jsonc
  "test": "pnpm lint",
  ```
  to:
  ```jsonc
  "test": "pnpm lint && pnpm test:unit",
  "test:unit": "vitest run",
  ```
  (Place `test:unit` immediately after `test`.)

**Verify**: `pnpm install` → exit 0 (vitest resolves from the catalog). Then
`node -e "const s=require('./package.json').scripts; if(!s['test:unit']||s.test!=='pnpm lint && pnpm test:unit') process.exit(1)"` → exit 0.

### Step 3: Delete the placeholder test

Remove `packages/devtools/client/tests/basic.test.ts` (the `1 + 2 === 3`
placeholder). It is excluded by the config anyway and gives false coverage signal.

**Verify**: `test ! -f packages/devtools/client/tests/basic.test.ts && echo GONE`
→ prints `GONE`.

### Step 4: Add the first real unit test

Create `packages/devtools/test/serialize-js-literal.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { toJsLiteral } from '../src/utils/serialize-js-literal'

describe('toJsLiteral', () => {
  it('serializes primitives', () => {
    expect(toJsLiteral(null)).toBe('null')
    expect(toJsLiteral(undefined)).toBe('undefined')
    expect(toJsLiteral(42)).toBe('42')
    expect(toJsLiteral(true)).toBe('true')
    expect(toJsLiteral('a"b')).toBe('"a\\"b"')
  })

  it('serializes arrays and objects', () => {
    expect(toJsLiteral([1, 2])).toBe('[1, 2]')
    expect(toJsLiteral({ a: 1 })).toBe('{ a: 1 }')
    expect(toJsLiteral({})).toBe('{}')
  })

  it('quotes non-identifier keys', () => {
    expect(toJsLiteral({ 'a-b': 1 })).toBe('{ "a-b": 1 }')
  })
})
```

**Verify**: `pnpm test:unit` → exit 0, this test file passes (3 tests).

### Step 5: Confirm lint is still clean

**Verify**: `pnpm lint` → exit 0. If lint flags the new files (import order,
quotes), run `pnpm lint --fix` and re-run `pnpm lint` → exit 0.

## Test plan

- New test file: `packages/devtools/test/serialize-js-literal.test.ts`, covering
  primitives, arrays/objects, and non-identifier key quoting of the pure
  `toJsLiteral` util. This both proves the runner works and pins real behavior.
- This is the structural pattern later plans follow: a `test/` dir sibling to
  `src/` inside a package, importing the unit under test from `../src/...`.
- Verification: `pnpm test:unit` → all pass (3 tests in 1 file).

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `vitest.config.ts` exists at the repo root.
- [ ] `pnpm install` exits 0.
- [ ] `pnpm test:unit` exits 0 and runs at least the `toJsLiteral` suite (3 tests pass).
- [ ] `package.json` `test` script equals `pnpm lint && pnpm test:unit` and a `test:unit` script exists.
- [ ] `packages/devtools/client/tests/basic.test.ts` no longer exists.
- [ ] `pnpm lint` exits 0.
- [ ] No files outside the in-scope list are modified (`git status`).
- [ ] `plans/README.md` status row for 001 updated.

## STOP conditions

Stop and report back (do not improvise) if:

- `pnpm install` fails, or `vitest` does not resolve from `catalog:cli` (the
  workspace catalog may have changed since this plan was written — see drift check).
- The `toJsLiteral` export or its behavior differs from the "Current state"
  excerpt (the util changed since this plan was written).
- Vitest picks up files under `packages/devtools/client/**` or `tests/e2e/**`
  despite the excludes (config semantics differ in the installed version) — do
  not start widening/narrowing globs blindly; report the actual matched set.
- A step's verification fails twice after a reasonable fix attempt.

## Maintenance notes

- Follow-up (separate plan/PR): add a `pnpm test:unit` step to
  `.github/workflows/ci.yml` (and/or `autofix.yml`) so unit tests run in CI, and
  consider whether `release` should gate on the full `test` (it already will,
  since `test` now includes `test:unit`).
- If a future test needs a `nuxt`/`@nuxt/kit` context, prefer extracting the pure
  logic into a testable helper (as plans 003/005 do) over mocking the whole Nuxt
  instance.
- Keep unit tests in `packages/<pkg>/test/` (not co-located in `src/`) so the
  package build (`unbuild` / `nuxt-build-module`) does not bundle them.
