# Plan 006: Enforce the storage mount denylist on item access, not just listing

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on. If a
> STOP condition occurs, stop and report — do not improvise. When done, update
> the status row for this plan in `plans/README.md` — unless a reviewer
> dispatched you and told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat c75c3b9..HEAD -- packages/devtools/src/server-rpc/storage.ts`
> If that file changed since this plan was written, compare the "Current state"
> excerpt against the live code; on a mismatch, STOP.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/001-unit-test-baseline.md
- **Category**: security
- **Planned at**: commit `c75c3b9`, 2026-07-14

## Why this matters

The storage RPC deliberately hides the `root`, `build`, `src`, and `cache`
unstorage mounts from the client — but only in the **listing** function
(`getStorageKeys` filters them). `getStorageItem`, `setStorageItem`, and
`removeStorageItem` apply **no** such filter, so a caller that names a key under
those mounts (e.g. `root:...`, `src:...`) can read, overwrite, or delete it. In
Nitro dev, `root`/`src` mounts are backed by the project filesystem, so this is a
filesystem read/write/delete primitive that the UI intends to keep off-limits. The
denylist is currently security-by-obscurity: hidden from view, but not access-gated.
This plan applies the existing guard to the item operations.

## Current state

- `packages/devtools/src/server-rpc/storage.ts`, verbatim:
  ```ts
  // storage.ts:6-9
  const IGNORE_STORAGE_MOUNTS = ['root', 'build', 'src', 'cache']
  function shouldIgnoreStorageKey(key: string) {
    return IGNORE_STORAGE_MOUNTS.includes(key.split(':')[0]!)
  }

  // storage.ts:60-87 — listing filters; item ops do NOT
  async getStorageKeys(base?: string) {
    if (!storage) return []
    try {
      const keys = await storage.getKeys(base)
      return keys.filter(key => !shouldIgnoreStorageKey(key))   // <-- guard here only
    }
    catch (err) {
      console.error(`Cloud not fetch storage keys for ${base}:`, err)
      return []
    }
  }
  async getStorageItem(key: string) {
    if (!storage) return null
    return await storage.getItem(key)                            // <-- no guard
  }
  async setStorageItem(key: string, value: StorageValue) {
    if (!storage) return
    return await storage.setItem(key, value)                     // <-- no guard
  }
  async removeStorageItem(key: string) {
    if (!storage) return
    return await storage.removeItem(key)                         // <-- no guard
  }
  ```
  (Note: the `console.error` string has a typo "Cloud not fetch" — fixing it is
  optional here; the storage denylist is the point.)

## Commands you will need

| Purpose       | Command                                  | Expected           |
|---------------|------------------------------------------|--------------------|
| Install       | `pnpm install`                           | exit 0             |
| This test     | `pnpm test:unit -- storage`              | new tests pass     |
| All unit tests| `pnpm test:unit`                         | exit 0             |
| Lint          | `pnpm lint` (autofix: `pnpm lint --fix`) | exit 0             |

## Scope

**In scope**:
- `packages/devtools/src/server-rpc/storage.ts` (export the predicate; gate item ops)
- `packages/devtools/test/storage-denylist.test.ts` (create)

**Out of scope** (do NOT touch):
- The mount discovery / `nitro:init` / watch wiring in the same file.
- `IGNORE_STORAGE_MOUNTS`'s membership — keep the same four mounts.
- Any other RPC module.

## Git workflow

- Branch: `fix/006-storage-denylist` off the base branch.
- Conventional Commits. Suggested: `fix(devtools): enforce storage mount denylist on item access`.
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Export the predicate so it is unit-testable

In `storage.ts`, make the existing helper exported (so a test can import it without
a storage instance):

```ts
export function shouldIgnoreStorageKey(key: string) {
  return IGNORE_STORAGE_MOUNTS.includes(key.split(':')[0]!)
}
```

**Verify**: `grep -n "export function shouldIgnoreStorageKey" packages/devtools/src/server-rpc/storage.ts` → 1 match.

### Step 2: Gate the three item operations

At the top of each of `getStorageItem`, `setStorageItem`, and `removeStorageItem`,
reject denied keys. Read returns `null`; write/remove no-op or throw consistently
with the existing early returns:

```ts
async getStorageItem(key: string) {
  if (!storage || shouldIgnoreStorageKey(key))
    return null
  return await storage.getItem(key)
},
async setStorageItem(key: string, value: StorageValue) {
  if (!storage || shouldIgnoreStorageKey(key))
    return
  return await storage.setItem(key, value)
},
async removeStorageItem(key: string) {
  if (!storage || shouldIgnoreStorageKey(key))
    return
  return await storage.removeItem(key)
},
```

**Verify**: `grep -c "shouldIgnoreStorageKey" packages/devtools/src/server-rpc/storage.ts`
→ at least 5 (definition + list filter + 3 item ops).

### Step 3: Unit-test the predicate

Create `packages/devtools/test/storage-denylist.test.ts` (pattern from plan 001):

```ts
import { describe, expect, it } from 'vitest'
import { shouldIgnoreStorageKey } from '../src/server-rpc/storage'

describe('shouldIgnoreStorageKey', () => {
  it('ignores denied mounts (root/build/src/cache) at any depth', () => {
    expect(shouldIgnoreStorageKey('root:nuxt.config.ts')).toBe(true)
    expect(shouldIgnoreStorageKey('src:pages/index.vue')).toBe(true)
    expect(shouldIgnoreStorageKey('build:x')).toBe(true)
    expect(shouldIgnoreStorageKey('cache:x')).toBe(true)
  })
  it('allows user mounts', () => {
    expect(shouldIgnoreStorageKey('db:users:1')).toBe(false)
    expect(shouldIgnoreStorageKey('redis:session')).toBe(false)
  })
})
```

> Importing `storage.ts` must not have import-time side effects beyond defining
> functions. If importing it pulls in `@nuxt/kit`/nitro types that break the test
> environment, move only the two pure symbols (`IGNORE_STORAGE_MOUNTS` +
> `shouldIgnoreStorageKey`) into a sibling `storage-keys.ts` and re-export from
> `storage.ts` — then import the helper from there in both the RPC and the test.

**Verify**: `pnpm test:unit -- storage` → all pass.

### Step 4: Lint

**Verify**: `pnpm lint` → exit 0 (`pnpm lint --fix` if needed).

## Test plan

- New file `packages/devtools/test/storage-denylist.test.ts` covering denied mounts
  and allowed user mounts.
- Verification: `pnpm test:unit` → all pass.

## Done criteria

- [ ] `shouldIgnoreStorageKey` (or the extracted module) is exported and imported by the test.
- [ ] `getStorageItem`/`setStorageItem`/`removeStorageItem` each reject denied keys.
- [ ] `pnpm test:unit` exits 0; the new storage test passes.
- [ ] `pnpm lint` exits 0.
- [ ] Only the in-scope files are modified/created (`git status`).
- [ ] `plans/README.md` status row for 006 updated.

## STOP conditions

Stop and report if:

- `storage.ts` doesn't match the "Current state" excerpt (drift).
- The DevTools storage UI legitimately needs to read one of the denied mounts (i.e.
  gating breaks an intended feature) — report the call site rather than removing the
  guard.
- A verification fails twice after a reasonable fix attempt.

## Maintenance notes

- If future work needs to surface a denied mount read-only, prefer an explicit
  allowlist toggle over removing the guard.
- Reviewer: confirm the guard is applied on all three item operations and that
  `getStorageKeys`'s existing filter is unchanged.
