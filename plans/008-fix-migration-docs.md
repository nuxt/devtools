# Plan 008: Fix the v4 migration guide's `enablePages` example

> **Executor instructions**: Follow this plan step by step. Confirm each
> verification before moving on. If a STOP condition occurs, stop and report.
> When done, update the status row for this plan in `plans/README.md` — unless a
> reviewer dispatched you and told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat c75c3b9..HEAD -- docs/content/2.module/3.migration-v4.md packages/devtools/src/server-rpc/general.ts`
> If either changed since this plan was written, re-read them and reconcile the
> excerpts below; on a mismatch, STOP.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: docs
- **Planned at**: commit `c75c3b9`, 2026-07-14

## Why this matters

The v4 migration guide tells module authors to replace `rpc.runWizard(token, 'enablePages')`
with `rpc.enablePages(token)` — but the current `enablePages` RPC takes **no
arguments** (auth tokens were removed from builtin RPC functions in v4). A module
author copying the documented replacement calls a signature that no longer accepts
`token`. A wrong doc example is worse than a missing one because it looks
authoritative.

## Current state

- `docs/content/2.module/3.migration-v4.md:72-81`, verbatim:
  ```md
  ## `runWizard` RPC Removed

  The `runWizard` server RPC function has been removed from `ServerFunctions`. The `enablePages` action is now available as a direct RPC function:

  ```diff
  - await rpc.runWizard(token, 'enablePages')
  + await rpc.enablePages(token)
  ```

  The `WizardFunctions`, `WizardActions`, and `GetWizardArgs` types have been removed from `@nuxt/devtools-kit`.
  ```
- The actual RPC signature, verbatim:
  ```ts
  // packages/devtools/src/server-rpc/general.ts:234
  async enablePages() {
  ```
  It takes no parameters.

## Commands you will need

| Purpose | Command       | Expected on success |
|---------|---------------|---------------------|
| Lint    | `pnpm lint`   | exit 0              |

(No install/build/tests needed — Markdown-only change.)

## Scope

**In scope**:
- `docs/content/2.module/3.migration-v4.md` (fix the one diff example; optionally add a note)

**Out of scope** (do NOT touch):
- Any source file (the RPC is already correct — the doc is wrong).
- Other docs pages (the stale contributing-guide pnpm version is a separate fix).
- The surrounding sections of the migration guide beyond the `runWizard` block.

## Git workflow

- Branch: `docs/008-migration-enablepages` off the base branch.
- Conventional Commits. Suggested: `docs: fix enablePages migration example (no token arg)`.
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Correct the diff example

In `docs/content/2.module/3.migration-v4.md`, change the added line so it matches
the real no-argument signature:

```diff
- await rpc.runWizard(token, 'enablePages')
+ await rpc.enablePages()
```

Optionally (recommended) add one sentence after the code block noting that builtin
RPC functions in v4 no longer take a leading auth token argument — this is the one
place a reader would expect that context. Keep it to a sentence; do not restructure
the page.

**Verify**: `grep -n "rpc.enablePages(token)" docs/content/2.module/3.migration-v4.md` → no matches; `grep -n "rpc.enablePages()" docs/content/2.module/3.migration-v4.md` → 1 match.

### Step 2: Lint

**Verify**: `pnpm lint` → exit 0 (`pnpm lint --fix` if the Markdown formatter flags it).

## Test plan

- No code tests. Verification is the two greps in Step 1 plus clean lint.

## Done criteria

- [ ] `grep -rn "rpc.enablePages(token)" docs/` returns no matches.
- [ ] The migration guide shows `+ await rpc.enablePages()`.
- [ ] `pnpm lint` exits 0.
- [ ] Only the migration-guide file is modified (`git status`).
- [ ] `plans/README.md` status row for 008 updated.

## STOP conditions

Stop and report if:

- The `enablePages` RPC signature is no longer `enablePages()` (i.e. it takes args
  again) — the doc fix would then be wrong.
- The migration guide's `runWizard` section doesn't match the "Current state"
  excerpt (drift).

## Maintenance notes

- If the deprecated auth exports are later removed (see plan 009 / audit Direction
  D2), add a short "builtin RPC functions no longer take an auth token" section here
  so the token removal is documented in one canonical place.
