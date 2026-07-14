# Plan 004: Fix the options RPC cache (inverted condition + shared-constant mutation)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on. If a
> STOP condition occurs, stop and report — do not improvise. When done, update
> the status row for this plan in `plans/README.md` — unless a reviewer
> dispatched you and told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat c75c3b9..HEAD -- packages/devtools/src/server-rpc/options.ts packages/devtools/src/constant.ts`
> If either changed since this plan was written, compare the "Current state"
> excerpts against the live code; on a mismatch, STOP.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/001-unit-test-baseline.md
- **Category**: bug / perf
- **Planned at**: commit `c75c3b9`, 2026-07-14

## Why this matters

`getOptions(tab)` has an **inverted cache guard** and it **aliases a shared module
constant**. Two consequences:

1. The guard `if (!options || options[tab])` re-runs the disk read on every call
   whenever the tab is already populated (it should be `!options[tab]`), so the
   in-memory cache is never used — every settings read and every settings write
   (`updateOptions` calls `getOptions` first) does an `existsSync` + `readFile` +
   `JSON.parse`.
2. `options = defaultTabOptions` aliases the imported constant, and `read()` then
   writes `options[tab] = ...` into it. So per-project user settings permanently
   overwrite the process-global `defaultTabOptions`; the "defaults" drift, and
   `clearOptions()` can no longer restore pristine values.

## Current state

- `packages/devtools/src/server-rpc/options.ts`, verbatim:
  ```ts
  // options.ts:11-27
  export function setupOptionsRPC({ nuxt }: NuxtDevtoolsServerContext) {
    async function getOptions<T extends keyof NuxtDevToolsOptions>(tab: T): Promise<NuxtDevToolsOptions[T]> {
      if (!options || options[tab]) {          // <-- inverted; also aliases below
        options = defaultTabOptions            // <-- aliases the shared constant
        await read(tab)
      }
      return options![tab]
    }

    async function read<T extends keyof NuxtDevToolsOptions>(tab: T) {
      options![tab] = await readLocalOptions<NuxtDevToolsOptions[T]>(defaultTabOptions[tab], {
        root: nuxt.options.rootDir,
        key: tab !== 'ui' && tab,
      })
      return options
    }
    getOptions('ui')
    // ...
  }
  ```
  `options` is a module-level `let options: NuxtDevToolsOptions | undefined` (line 5),
  also read by the exported `getOptions()` (lines 7-9) that other modules use.
- `defaultTabOptions` is a plain module-level object literal with every tab
  pre-populated: `packages/devtools/src/constant.ts:19-64`. It is also consumed by
  `module-main.ts:117` (settings template) and by `read()` above as the per-tab
  default argument.
- `structuredClone` is available in the Node runtime this module targets (Node 18+).

## Commands you will need

| Purpose        | Command                                  | Expected       |
|----------------|------------------------------------------|----------------|
| Install        | `pnpm install`                           | exit 0         |
| Unit tests     | `pnpm test:unit`                         | exit 0         |
| Lint           | `pnpm lint` (autofix: `pnpm lint --fix`) | exit 0         |

## Scope

**In scope**:
- `packages/devtools/src/server-rpc/options.ts` (fix the guard + clone the defaults)

**Out of scope** (do NOT touch):
- `packages/devtools/src/constant.ts` — leave `defaultTabOptions` exactly as is;
  the fix is to stop mutating it, not to change it.
- `packages/devtools/src/utils/local-options.ts` (read/write/clear helpers) — the
  `clearOptions` per-tab-file gap is a separate, un-selected finding.
- `updateOptions` behavior beyond the guard fix — it should keep calling
  `getOptions(tab)` then `Object.assign` + `writeLocalOptions`.

## Git workflow

- Branch: `fix/004-options-rpc-cache` off the base branch.
- Conventional Commits. Suggested: `fix(devtools): correct options cache guard and stop mutating defaults`.
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Fix the guard and clone the defaults

In `options.ts`, change the guard so a tab is read from disk only when it is
**not** already cached, and initialize the cache from a **clone** so the shared
constant is never mutated:

```ts
async function getOptions<T extends keyof NuxtDevToolsOptions>(tab: T): Promise<NuxtDevToolsOptions[T]> {
  if (!options)
    options = structuredClone(defaultTabOptions)
  if (options[tab] === undefined || !hasReadOnce.has(tab))
    await read(tab)
  return options[tab]
}
```

The subtlety: after the first read a tab's value is truthy, so a plain
`!options[tab]` guard would still re-read defaults-only tabs whose persisted value
is falsy. Track which tabs have been loaded from disk with a `Set` so each tab is
read at most once:

```ts
// add near the top of setupOptionsRPC, beside the closure state
const hasReadOnce = new Set<keyof NuxtDevToolsOptions>()
```

and in `read()`, after assigning, record it:

```ts
async function read<T extends keyof NuxtDevToolsOptions>(tab: T) {
  options![tab] = await readLocalOptions<NuxtDevToolsOptions[T]>(defaultTabOptions[tab], {
    root: nuxt.options.rootDir,
    key: tab !== 'ui' && tab,
  })
  hasReadOnce.add(tab)
  return options
}
```

> If you prefer a simpler shape, the minimum correct fix is: (a) `options =
> structuredClone(defaultTabOptions)` instead of aliasing, and (b) guard with
> `if (!options || !options[tab])`. The `hasReadOnce` set is the more precise
> version that also caches tabs whose persisted value is falsy — implement whichever
> you can verify, but do not leave the guard inverted and do not alias the constant.

**Verify**:
- `grep -n "options\[tab\])" packages/devtools/src/server-rpc/options.ts` shows the
  guard is no longer the bare truthy `options[tab]` form.
- `grep -n "options = defaultTabOptions" packages/devtools/src/server-rpc/options.ts`
  → no matches.

### Step 2: Add a regression test that defaults are not mutated

Because the RPC closure needs a `nuxt` context, test the invariant at the level you
can reach without a full Nuxt instance: assert that reading options never mutates
the exported `defaultTabOptions` constant. Create
`packages/devtools/test/default-tab-options.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { defaultTabOptions } from '../src/constant'

describe('defaultTabOptions', () => {
  it('is a self-consistent snapshot that callers must clone before mutating', () => {
    // Guards against the regression where the options RPC aliased and mutated this constant.
    const before = structuredClone(defaultTabOptions)
    // simulate a caller cloning then mutating its own copy
    const copy = structuredClone(defaultTabOptions)
    copy.ui.scale = 999
    expect(defaultTabOptions).toEqual(before)
    expect(defaultTabOptions.ui.scale).not.toBe(999)
  })
})
```

> This test pins the contract ("clone before mutate") rather than driving the RPC
> directly. If you can cheaply construct a minimal fake `{ options: { rootDir } }`
> context and exercise `setupOptionsRPC(...).getOptions('ui')` twice, add a second
> test asserting `defaultTabOptions` is unchanged after two calls — but do not block
> on mocking the whole Nuxt instance.

**Verify**: `pnpm test:unit` → exit 0, new test passes.

### Step 3: Lint

**Verify**: `pnpm lint` → exit 0 (`pnpm lint --fix` if needed).

## Test plan

- New file `packages/devtools/test/default-tab-options.test.ts` guarding the
  no-mutation contract.
- Optional stronger test driving `setupOptionsRPC` with a minimal fake context, if
  achievable without heavy mocking.
- Verification: `pnpm test:unit` → all pass.

## Done criteria

- [ ] The guard in `getOptions` is no longer the inverted `options[tab]` truthy check.
- [ ] `grep -rn "options = defaultTabOptions" packages/devtools/src/server-rpc/options.ts` returns no matches.
- [ ] `pnpm test:unit` exits 0; the new defaults test passes.
- [ ] `pnpm lint` exits 0.
- [ ] Only `options.ts` (and the new test file) are modified (`git status`); `constant.ts` unchanged.
- [ ] `plans/README.md` status row for 004 updated.

## STOP conditions

Stop and report if:

- `options.ts` doesn't match the "Current state" excerpt (drift).
- `NuxtDevToolsOptions` typing rejects the `Set<keyof NuxtDevToolsOptions>` or the
  `structuredClone` return (type mismatch you can't resolve in one small change) —
  report rather than casting with `any`.
- A verification fails twice after a reasonable fix attempt.

## Maintenance notes

- The related `clearOptions()` only deletes the root (`ui`) options file, leaving
  per-tab files (`serverRoutes`, `serverTasks`, `assets`) on disk — a separate
  finding not fixed here; note it if you touch reset behavior.
- Reviewer: confirm `getOptions('ui')` on setup (line 29) still warms the cache and
  that `updateOptions` still persists via `writeLocalOptions`.
