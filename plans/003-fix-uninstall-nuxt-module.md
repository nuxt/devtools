# Plan 003: Fix `uninstallNuxtModule` so it removes the right module from nuxt.config

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If a STOP condition occurs, stop and report — do not improvise.
> When done, update the status row for this plan in `plans/README.md` — unless a
> reviewer dispatched you and told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat c75c3b9..HEAD -- packages/devtools/src/server-rpc/npm.ts`
> If that file changed since this plan was written, compare the "Current state"
> excerpt against the live code before proceeding; on a mismatch, STOP.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/001-unit-test-baseline.md
- **Category**: bug
- **Planned at**: commit `c75c3b9`, 2026-07-14

## Why this matters

`uninstallNuxtModule` edits the user's `nuxt.config` and writes it back to disk.
Its module-removal logic uses `config.modules.splice(index - 1, 1)` inside a
`forEach` over `Object.values(config.modules)`. The `index - 1` is an off-by-one:
the module the user asked to uninstall is **never removed**, and a different,
innocent module is deleted instead (for a target at index 0, `splice(-1, 1)`
removes the *last* module). The corrupted config is then persisted and Nuxt
restarts. This is silent user-config data loss on a headline "remove module"
feature. This plan replaces the manual splice with correct, tested removal logic.

## Current state

- `packages/devtools/src/server-rpc/npm.ts` — the `uninstallNuxtModule` RPC. The
  buggy block, verbatim:
  ```ts
  // packages/devtools/src/server-rpc/npm.ts:147-162
  const generated = await magicastGuard(async () => {
    const mod = parseModule(source, { sourceFileName: filepath })

    // TODO: remove module from config
    // removeNuxtModule(mod, name)
    const config = getDefaultExportOptions(mod)
    config.modules ||= []
    if (config.modules.includes(name)) {
      Object.values(config.modules).forEach((value, index) => {
        if (value === name)
          config.modules.splice(index - 1, 1)
      })
    }

    return mod.generate().code
  })
  ```
- Imports already present at the top of the file:
  ```ts
  // packages/devtools/src/server-rpc/npm.ts:5-6
  import { parseModule } from 'magicast'
  import { addNuxtModule, getDefaultExportOptions } from 'magicast/helpers'
  ```
  `magicast` is pinned at `^0.5.3` (`pnpm-workspace.yaml` catalog `prod`).
- The install counterpart uses `addNuxtModule(mod, name)` from `magicast/helpers`
  (`npm.ts:6,96`) — the removal should be symmetric.
- Two behaviors the current code gets wrong that the fix must handle:
  1. A module listed as a **string** (`modules: ['@nuxt/image']`).
  2. A module listed as an **array tuple** with options
     (`modules: [['@nuxt/image', { ... }]]`) — `includes(name)` never matches these,
     so such entries are never removable today.

## Commands you will need

| Purpose        | Command                                                   | Expected             |
|----------------|-----------------------------------------------------------|----------------------|
| Install        | `pnpm install`                                            | exit 0               |
| Run this test  | `pnpm test:unit -- remove-nuxt-module`                    | new tests pass       |
| All unit tests | `pnpm test:unit`                                          | exit 0               |
| Lint           | `pnpm lint` (autofix: `pnpm lint --fix`)                  | exit 0               |

## Suggested executor toolkit

- The `magicast` docs (https://github.com/unjs/magicast) describe `parseModule`,
  `getDefaultExportOptions`, and the `addNuxtModule`/`removeNuxtModule` helpers.
  **Check whether `magicast/helpers` exports `removeNuxtModule`** in the installed
  version (`node -e "console.log(Object.keys(require('magicast/helpers')))"` after
  install). If it does, prefer it (see Step 1 option A); if not, use the manual
  filter (option B).

## Scope

**In scope**:
- `packages/devtools/src/server-rpc/npm.ts` (modify the removal logic only)
- `packages/devtools/src/utils/nuxt-config.ts` (create — a small testable helper)
- `packages/devtools/test/remove-nuxt-module.test.ts` (create)

**Out of scope** (do NOT touch):
- The `installNuxtModule` function and its dry-run/subprocess flow — unchanged.
- The subprocess-spawning path of `uninstallNuxtModule` (`startSubprocess`,
  `getResult`, `fs.writeFile`) — only the magicast config-rewrite closure changes.
- The `getNpmCommand` argv construction — a separate concern (not this plan).

## Git workflow

- Branch: `fix/003-uninstall-nuxt-module` off the base branch.
- Conventional Commits (repo style, e.g. `fix(devtools): ...`).
  Suggested: `fix(devtools): remove the correct module in uninstallNuxtModule`.
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Extract a pure, testable config-removal helper

Create `packages/devtools/src/utils/nuxt-config.ts` exporting a pure function that
takes source code + a module name and returns the rewritten code. This isolates the
AST logic so it can be unit-tested without a Nuxt instance or the filesystem.

Preferred shape:

```ts
import { parseModule } from 'magicast'
import { getDefaultExportOptions } from 'magicast/helpers'

/**
 * Return `source` with `name` removed from the Nuxt config `modules` array.
 * Handles both string entries (`'@nuxt/image'`) and tuple entries
 * (`['@nuxt/image', {...}]`). If the module isn't present, returns the code
 * unchanged.
 */
export function removeNuxtModuleFromCode(source: string, name: string, filepath?: string): string {
  const mod = parseModule(source, filepath ? { sourceFileName: filepath } : undefined)
  const config = getDefaultExportOptions(mod)
  if (!Array.isArray(config.modules))
    return mod.generate().code

  config.modules = config.modules.filter((entry: unknown) => {
    if (typeof entry === 'string')
      return entry !== name
    if (Array.isArray(entry))
      return entry[0] !== name
    return true
  })

  return mod.generate().code
}
```

> If Step-1 investigation shows `magicast/helpers` exports a working
> `removeNuxtModule(mod, name)`, you may implement the helper by calling it instead
> of the manual `filter` — but keep the same pure `(source, name) => code`
> signature and the same tuple/string handling, and keep the unit tests.

**Verify**: `test -f packages/devtools/src/utils/nuxt-config.ts && echo OK` → `OK`.

### Step 2: Write the failing-then-passing unit tests

Create `packages/devtools/test/remove-nuxt-module.test.ts` (model it after
`packages/devtools/test/serialize-js-literal.test.ts` created in plan 001):

```ts
import { describe, expect, it } from 'vitest'
import { removeNuxtModuleFromCode } from '../src/utils/nuxt-config'

const base = `export default defineNuxtConfig({\n  modules: ['@nuxt/image', '@nuxt/content'],\n})\n`

describe('removeNuxtModuleFromCode', () => {
  it('removes the requested module and keeps the others', () => {
    const out = removeNuxtModuleFromCode(base, '@nuxt/image')
    expect(out).not.toContain('@nuxt/image')
    expect(out).toContain('@nuxt/content')
  })

  it('removes the first module without dropping the last', () => {
    const out = removeNuxtModuleFromCode(base, '@nuxt/image')
    expect(out).toContain('@nuxt/content') // regression guard for the splice(-1) bug
  })

  it('removes a module declared as a tuple with options', () => {
    const src = `export default defineNuxtConfig({\n  modules: [['@nuxt/image', { quality: 80 }], '@nuxt/content'],\n})\n`
    const out = removeNuxtModuleFromCode(src, '@nuxt/image')
    expect(out).not.toContain('@nuxt/image')
    expect(out).toContain('@nuxt/content')
  })

  it('is a no-op when the module is absent', () => {
    const out = removeNuxtModuleFromCode(base, '@nuxt/not-there')
    expect(out).toContain('@nuxt/image')
    expect(out).toContain('@nuxt/content')
  })
})
```

**Verify**: `pnpm test:unit -- remove-nuxt-module` → all 4 tests pass.

### Step 3: Call the helper from `uninstallNuxtModule`

In `packages/devtools/src/server-rpc/npm.ts`, replace the buggy closure body
(lines 147-162 in the excerpt) so the `magicastGuard` callback delegates to the
helper. Result shape:

```ts
import { removeNuxtModuleFromCode } from '../utils/nuxt-config'
// ...
const generated = await magicastGuard(async () => {
  return removeNuxtModuleFromCode(source, name, filepath)
})
```

Remove the now-obsolete `// TODO: remove module from config` and
`// removeNuxtModule(mod, name)` comments. If `parseModule` / `getDefaultExportOptions`
are no longer referenced elsewhere in `npm.ts`, remove their now-unused imports
(the install path still imports `parseModule` and `addNuxtModule` — leave those).

**Verify**:
- `pnpm test:unit` → exit 0.
- `grep -n "splice(index - 1" packages/devtools/src/server-rpc/npm.ts` → no matches.
- `pnpm lint` → exit 0 (run `pnpm lint --fix` if needed).

## Test plan

- New file `packages/devtools/test/remove-nuxt-module.test.ts` covering: removing a
  present string module, the first-element regression (the exact splice bug), a
  tuple-with-options entry, and the absent-module no-op.
- Structural pattern: `packages/devtools/test/serialize-js-literal.test.ts` (plan 001).
- Verification: `pnpm test:unit` → all pass including the 4 new tests.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `pnpm test:unit` exits 0; `remove-nuxt-module.test.ts` exists with the 4 cases and passes.
- [ ] `grep -rn "splice(index - 1" packages/devtools/src` returns no matches.
- [ ] `removeNuxtModuleFromCode` is imported and used in `npm.ts`'s `uninstallNuxtModule`.
- [ ] `pnpm lint` exits 0.
- [ ] Only the three in-scope files are modified/created (`git status`).
- [ ] `plans/README.md` status row for 003 updated.

## STOP conditions

Stop and report (do not improvise) if:

- The `uninstallNuxtModule` code doesn't match the "Current state" excerpt (drift).
- `magicast`'s `getDefaultExportOptions(mod).modules` is not a plain array at
  runtime for the test fixtures (the config shape differs) — report what it is.
- Reassigning `config.modules = config.modules.filter(...)` does not reflect into
  `mod.generate().code` (magicast proxy semantics differ in the installed version).
  In that case, do NOT hand-roll string surgery — report and stop so the approach
  can be revisited (e.g. mutate in place / use `removeNuxtModule`).
- A verification fails twice after a reasonable fix attempt.

## Maintenance notes

- If magicast later ships a stable `removeNuxtModule`, collapse the helper onto it
  but keep the tuple/string tests as the contract.
- Follow-up (Direction D1 in the audit): mirror the install flow's dry-run preview
  for uninstall and ensure `package.json` is updated by the subprocess, so the
  modules tab supports trustworthy round-trip add/remove.
- Reviewer: confirm the subprocess/`fs.writeFile` path around the closure is
  untouched and that dry-run (`dry = true`) still returns `configGenerated`.
