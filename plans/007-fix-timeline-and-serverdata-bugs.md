# Plan 007: Fix two small correctness bugs (function-metric metadata + server-data environments)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on. If a
> STOP condition occurs, stop and report — do not improvise. When done, update
> the status row for this plan in `plans/README.md` — unless a reviewer
> dispatched you and told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat c75c3b9..HEAD -- packages/devtools/src/runtime/function-metrics-helpers.ts packages/devtools/src/server-rpc/server-data.ts`
> If either changed since this plan was written, compare the "Current state"
> excerpts against the live code; on a mismatch, STOP.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/001-unit-test-baseline.md
- **Category**: bug
- **Planned at**: commit `c75c3b9`, 2026-07-14

## Why this matters

Two independent, one-line-ish correctness bugs, each producing wrong data:

1. **Function-metric wrapper corrupts `Function.length`** — the timeline wrapper
   does `Object.defineProperty(wrappred, 'length', { value: fn.name || name })`,
   assigning a **string** to `length` (which is the function's arity, a number) and
   never restoring `name`. Any consumer that inspects a wrapped composable's
   `.length` (arity-based dispatch) or `.name` sees wrong values.
2. **`server-data` mislabels env as environments** — `normalizeViteConfig` builds
   its `environments` map by iterating `config.env` (Vite's `import.meta.env`
   values: `MODE`, `DEV`, `BASE_URL`, ...) instead of `config.environments`. The
   DevTools "server data" view then shows an `environments` object keyed by
   env-variable names (all `null`) rather than the real Vite environments.

## Current state

- `packages/devtools/src/runtime/function-metrics-helpers.ts:93`, verbatim:
  ```ts
  Object.defineProperty(wrappred, 'length', { value: fn.name || name })
  ```
  (`wrappred` is the wrapper function created at line 58; `name` is the wrapper's
  argument; `fn` is the wrapped function.)
- `packages/devtools/src/server-rpc/server-data.ts:14-29`, verbatim:
  ```ts
  function normalizeViteConfig(config: ResolvedConfig) {
    return {
      ...config,
      environments: Object.fromEntries(
        Object.entries(config.env).map(([key, _]) => {   // <-- iterates config.env
          return [key, null]
        }),
      ),
      plugins: config.plugins.map((i) => {
        const clone = { ...i }
        delete clone.api
        return clone
      }),
      inlineConfig: null,
    } as any as ResolvedConfig
  }
  ```
  The intent (per the comment "Avoid sending the Vite instance to the client") is to
  null out the heavy/circular `config.environments`, keeping `config.env` as-is via
  the spread.

## Commands you will need

| Purpose        | Command                                  | Expected           |
|----------------|------------------------------------------|--------------------|
| Install        | `pnpm install`                           | exit 0             |
| This test      | `pnpm test:unit -- normalize-vite-config`| new tests pass     |
| All unit tests | `pnpm test:unit`                         | exit 0             |
| Lint           | `pnpm lint` (autofix: `pnpm lint --fix`) | exit 0             |

## Scope

**In scope**:
- `packages/devtools/src/runtime/function-metrics-helpers.ts` (fix line 93)
- `packages/devtools/src/server-rpc/server-data.ts` (fix `normalizeViteConfig` + make it testable)
- `packages/devtools/test/normalize-vite-config.test.ts` (create)

**Out of scope** (do NOT touch):
- The rest of the timeline wrapper's promise handling (a separate un-selected finding).
- `getServerConfig`/`getServerData` return shapes beyond the `environments` fix.
- Any duplicate-`getServerConfig` cleanup (that's plan 009).

## Git workflow

- Branch: `fix/007-metadata-and-environments` off the base branch.
- Conventional Commits. Suggested: `fix(devtools): correct wrapped fn name and vite environments normalization`.
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Fix the function metadata property

In `function-metrics-helpers.ts:93`, set `name` (not `length`):

```ts
Object.defineProperty(wrappred, 'name', { value: fn.name || name })
```

**Verify**: `grep -n "defineProperty(wrappred, 'length'" packages/devtools/src/runtime/function-metrics-helpers.ts` → no matches; `grep -n "defineProperty(wrappred, 'name'" ...` → 1 match.

### Step 2: Make `normalizeViteConfig` testable and correct

Extract the config-normalization into a pure exported helper so it can be tested
without a Vite server, and iterate `config.environments`:

```ts
export function normalizeViteConfig(config: ResolvedConfig) {
  return {
    ...config,
    environments: Object.fromEntries(
      Object.entries(config.environments ?? {}).map(([key]) => [key, null]),
    ),
    plugins: (config.plugins ?? []).map((i) => {
      const clone = { ...i }
      delete clone.api
      return clone
    }),
    inlineConfig: null,
  } as any as ResolvedConfig
}
```

Keep it inside the module (it's already a local function); just add `export` and
change `config.env` → `config.environments` with the `?? {}` guard. Everything else
(the `plugins` map, `inlineConfig: null`, the `as any as ResolvedConfig` cast) stays.

**Verify**: `grep -n "Object.entries(config.env)" packages/devtools/src/server-rpc/server-data.ts` → no matches.

### Step 3: Unit-test `normalizeViteConfig`

Create `packages/devtools/test/normalize-vite-config.test.ts` (pattern from plan 001):

```ts
import { describe, expect, it } from 'vitest'
import { normalizeViteConfig } from '../src/server-rpc/server-data'

describe('normalizeViteConfig', () => {
  it('nulls out real vite environments (not env vars)', () => {
    const fake = {
      env: { MODE: 'development', DEV: true, BASE_URL: '/' },
      environments: { client: { x: 1 }, ssr: { y: 2 } },
      plugins: [{ name: 'p', api: { huge: true } }],
      inlineConfig: { big: true },
    } as any
    const out = normalizeViteConfig(fake) as any
    // environments keyed by environment names, all nulled
    expect(out.environments).toEqual({ client: null, ssr: null })
    // env vars are preserved untouched via the spread
    expect(out.env).toEqual({ MODE: 'development', DEV: true, BASE_URL: '/' })
    // plugin api stripped, inlineConfig nulled
    expect(out.plugins[0].api).toBeUndefined()
    expect(out.inlineConfig).toBeNull()
  })

  it('tolerates missing environments/plugins', () => {
    const out = normalizeViteConfig({ env: {} } as any) as any
    expect(out.environments).toEqual({})
    expect(out.plugins).toEqual([])
  })
})
```

> If importing `server-data.ts` triggers `@nuxt/kit` import-time work that breaks
> the test env, move `normalizeViteConfig` into a sibling pure module
> `normalize-vite-config.ts` and re-export it from `server-data.ts`; import from the
> pure module in the test.

**Verify**: `pnpm test:unit -- normalize-vite-config` → all pass.

### Step 4: Lint

**Verify**: `pnpm lint` → exit 0 (`pnpm lint --fix` if needed).

## Test plan

- New file `packages/devtools/test/normalize-vite-config.test.ts` covering: real
  environments nulled, env vars preserved, plugin `api` stripped, `inlineConfig`
  nulled, and the missing-fields tolerance.
- The function-metadata fix (Step 1) is verified by the two greps in that step (a
  runtime test would require a browser/`window`; the grep contract is sufficient
  and machine-checkable).
- Verification: `pnpm test:unit` → all pass.

## Done criteria

- [ ] `grep -rn "defineProperty(wrappred, 'length'" packages/devtools/src` → no matches.
- [ ] `grep -rn "Object.entries(config.env)" packages/devtools/src` → no matches.
- [ ] `pnpm test:unit` exits 0; `normalize-vite-config.test.ts` passes.
- [ ] `pnpm lint` exits 0.
- [ ] Only the in-scope files are modified/created (`git status`).
- [ ] `plans/README.md` status row for 007 updated.

## STOP conditions

Stop and report if:

- Either file doesn't match its "Current state" excerpt (drift).
- `ResolvedConfig` in the installed Vite version has no `environments` property (the
  fix's premise would be wrong) — report the actual shape.
- A verification fails twice after a reasonable fix attempt.

## Maintenance notes

- The timeline promise wrapper (`function-metrics-helpers.ts:79-85`) has a separate
  latent issue (a detached `.then().finally()` chain that can produce an unhandled
  rejection and a dead `return result` in `finally`) — not fixed here; note it if you
  touch that block.
- Reviewer: confirm the `normalizeViteConfig` cast and the `plugins`/`inlineConfig`
  handling are unchanged apart from the `env`→`environments` source swap.
