# Plan 009: Remove dead code left by the Vite DevTools auth migration

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on. If a
> STOP condition occurs, stop and report — do not improvise. When done, update
> the status row for this plan in `plans/README.md` — unless a reviewer
> dispatched you and told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat c75c3b9..HEAD -- packages/devtools/src/dev-auth.ts packages/devtools/src/constant.ts packages/devtools/src/server-rpc/general.ts packages/devtools/src/server-rpc/server-data.ts`
> If any changed since this plan was written, compare the "Current state" excerpts
> against the live code; on a mismatch, STOP.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: MED
- **Depends on**: plans/001-unit-test-baseline.md
- **Category**: tech-debt
- **Planned at**: commit `c75c3b9`, 2026-07-14

## Why this matters

v4 delegated authorization to Vite DevTools, but the migration left dead code that
makes it ambiguous whether DevTools still has its own auth: an entirely unused
token-generating module, a duplicate RPC definition that can never run, and a config
default for an option that is now a no-op. The alpha is the right window to remove
unambiguously-dead code before the API surface stabilizes. This plan removes only
the **safe, verified-dead** items; it explicitly defers the breaking removal of
deprecated public exports and dead UI branches to a maintainer decision (see
Maintenance notes).

## Current state (all verified dead at commit `c75c3b9`)

- `packages/devtools/src/dev-auth.ts` — exports `getDevAuthToken()`. Grep across
  `packages/*/src` finds **zero** callers (only the module's own definition). The
  whole module is dead. (It also generates a token with a non-crypto RNG and writes
  it world-readable to `~/.nuxt/devtools/dev-auth-token.txt`; not reached today.)
- Duplicate `getServerConfig`: defined in **both**
  - `packages/devtools/src/server-rpc/general.ts:87-89`:
    ```ts
    getServerConfig(): NuxtOptions {
      return nuxt.options as unknown as NuxtOptions
    },
    ```
  - `packages/devtools/src/server-rpc/server-data.ts:60-62`:
    ```ts
    getServerConfig() {
      return nuxt.options
    },
    ```
  In `packages/devtools/src/server-rpc/index.ts:118-132`, `Object.assign` spreads
  `setupGeneralRPC` (line 119) **before** `setupServerDataRPC` (line 131), so the
  server-data version wins and the general.ts one is dead. Both return `nuxt.options`,
  so removing the general.ts copy is behavior-preserving. The client calls
  `rpc.getServerConfig()` (`client/composables/state.ts:39`) — that keeps working.
- `packages/devtools/src/constant.ts` — a default for the now-no-op `disableAuthorization`:
  ```ts
  // constant.ts:2,4,16
  import { provider } from 'std-env'
  const isSandboxed = provider === 'stackblitz' || provider === 'codesandbox'
  // ...
  disableAuthorization: isSandboxed,
  ```
  Grep confirms `options.disableAuthorization` is never read anywhere; `provider` /
  `isSandboxed` are used **only** for this default.

## Commands you will need

| Purpose        | Command                                  | Expected           |
|----------------|------------------------------------------|--------------------|
| Install        | `pnpm install`                           | exit 0             |
| Unit tests     | `pnpm test:unit`                         | exit 0             |
| Lint           | `pnpm lint` (autofix: `pnpm lint --fix`) | exit 0             |
| Build (module) | `pnpm -C packages/devtools build`        | exit 0             |

(`pnpm build` regenerates the client `.nuxt` typing that `typecheck` needs; run it
before typecheck if you choose to typecheck — see STOP conditions for the fallback.)

## Scope

**In scope**:
- `packages/devtools/src/dev-auth.ts` (delete)
- `packages/devtools/src/server-rpc/general.ts` (remove the dead `getServerConfig`)
- `packages/devtools/src/constant.ts` (remove the `disableAuthorization` default + now-unused `std-env` import and `isSandboxed`)

**Out of scope** (do NOT touch — these are breaking or template-risky; deferred):
- `requestForAuth` / `verifyAuthToken` deprecated no-op RPCs in `general.ts:266-274`
  — they are a public back-compat surface; removing them is a breaking change.
- `packages/devtools/client/composables/dev-auth.ts` — it still exports the **used**
  `userAgentInfo`; the deprecated exports there are entangled with it.
- The dead `v-if="!isDevAuthed"` UI branches in
  `client/pages/modules/overview.vue:142` and `client/pages/modules/custom-[name].vue:32,55`
  — editing Vue templates to remove dead branches is deferred.
- The `disableAuthorization?: boolean` type in `devtools-kit/src/_types/options.ts:49`
  and the deprecation warning in `module-main.ts:41-42` — leave both so the warning
  keeps firing for users who still pass the option.

## Git workflow

- Branch: `chore/009-remove-dead-auth-code` off the base branch.
- Conventional Commits. Suggested: `chore(devtools): remove dead auth-migration code`.
  Consider one commit per step for reviewability.
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Delete the unused dev-auth module

Delete `packages/devtools/src/dev-auth.ts`.

**Verify**: `test ! -f packages/devtools/src/dev-auth.ts && echo GONE` → `GONE`.
`grep -rn "getDevAuthToken\|dev-auth'" packages/devtools/src` → no matches.

### Step 2: Remove the duplicate dead `getServerConfig`

In `packages/devtools/src/server-rpc/general.ts`, delete the `getServerConfig`
method (the 3 lines at 87-89 in the excerpt). Leave the surviving definition in
`server-data.ts` untouched. If removing it makes the `NuxtOptions` type import unused
in `general.ts`, remove that import too (only if unused — check first).

**Verify**: `grep -rn "getServerConfig" packages/devtools/src/server-rpc/general.ts` → no matches. `grep -rn "getServerConfig" packages/devtools/src/server-rpc/server-data.ts` → 1 match.

### Step 3: Remove the `disableAuthorization` default

In `packages/devtools/src/constant.ts`, remove the `disableAuthorization: isSandboxed,`
line from `defaultOptions`, then remove the now-unused `const isSandboxed = ...` line
and the `import { provider } from 'std-env'` line.

**Verify**: `grep -n "disableAuthorization\|isSandboxed\|std-env" packages/devtools/src/constant.ts` → no matches.

### Step 4: Verify nothing broke

- `pnpm test:unit` → exit 0 (existing unit tests still pass; no new tests needed —
  this plan only deletes dead code).
- `pnpm lint` → exit 0 (`pnpm lint --fix` if needed).
- `pnpm -C packages/devtools build` → exit 0 (confirms the module still builds after
  the import removals).

## Test plan

- No new tests (dead-code removal). The safety net is: existing `pnpm test:unit`
  passing, a clean `pnpm lint`, and a successful module build.
- Reviewer confirms `rpc.getServerConfig()` still resolves (served by `server-data.ts`).

## Done criteria

- [ ] `packages/devtools/src/dev-auth.ts` no longer exists.
- [ ] `grep -rn "getDevAuthToken" packages` → no matches.
- [ ] `general.ts` no longer defines `getServerConfig`; `server-data.ts` still does.
- [ ] `grep -n "disableAuthorization\|isSandboxed\|std-env" packages/devtools/src/constant.ts` → no matches.
- [ ] `pnpm test:unit` exits 0; `pnpm lint` exits 0; `pnpm -C packages/devtools build` exits 0.
- [ ] Only the three in-scope files are modified/deleted (`git status`).
- [ ] `plans/README.md` status row for 009 updated.

## STOP conditions

Stop and report (do not improvise) if:

- Any in-scope file doesn't match its "Current state" excerpt (drift), OR a grep
  reveals a caller of `getDevAuthToken` / a second consumer of `options.disableAuthorization`
  that this plan assumed absent.
- Removing the `general.ts` `getServerConfig` changes the served behavior (e.g.
  `server-data.ts` no longer registers it) — verify the `Object.assign` order in
  `index.ts` still favors server-data before deleting.
- The module build fails after the import removals.
- `pnpm build` can't run (missing deps/offline) so you can't verify Step 4's build —
  do NOT skip verification silently; report that the build check couldn't run.

## Maintenance notes

- **Deferred (maintainer decision, breaking):** removing the deprecated public
  exports — `requestForAuth`/`verifyAuthToken` RPC no-ops (`general.ts:266-274`),
  the deprecated exports in `client/composables/dev-auth.ts`, the `disableAuthorization`
  type (`devtools-kit/_types/options.ts:49`) — and the now-dead `v-if="!isDevAuthed"`
  UI branches. These are a coordinated breaking change (audit Direction D2); do them
  as a dedicated PR with a migration-guide note, ideally still within the alpha.
- Reviewer: scrutinize the `constant.ts` import removals (no dangling `provider`
  reference) and confirm the DevTools client still loads config after the dup removal.
