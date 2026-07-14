# Plan 002: Add a root AGENTS.md describing build order and repo conventions

> **Executor instructions**: Follow this plan step by step. Confirm each
> verification before moving on. If a STOP condition occurs, stop and report.
> When done, update the status row for this plan in `plans/README.md` — unless a
> reviewer dispatched you and told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat c75c3b9..HEAD -- package.json turbo.json`
> If those files changed since this plan was written, re-read them and reconcile
> the commands/scripts quoted below before writing the doc.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: dx / docs
- **Planned at**: commit `c75c3b9`, 2026-07-14

## Why this matters

There is no `AGENTS.md` or `CLAUDE.md` at the repo root, and the build ordering is
non-obvious: the root `tsconfig.json` extends a **generated** file
(`packages/devtools/client/.nuxt/tsconfig.json`) that only exists after
`pnpm prepare`, so `pnpm typecheck` fails on a fresh clone until prepare/build has
run. `pnpm test` is also misleading — after plan 001 it runs lint + unit tests, and
before that it was lint only. An agent (or new contributor) that doesn't know this
wastes cycles on failing typecheck runs. A short root `AGENTS.md` captures the
essentials so future automated and human contributors start correctly.

## Current state

- No `AGENTS.md`/`CLAUDE.md` at the repo root (verified by glob). Root has only a
  one-line `CONTRIBUTING.md` that redirects to the docs site.
- `package.json` scripts (root), verbatim facts to encode:
  - `build`: `turbo run build`
  - `dev`: `pnpm run build && pnpm -C packages/devtools dev`
  - `lint`: `eslint --cache .`
  - `typecheck`: `vue-tsc --noEmit`
  - `test`: `pnpm lint` (becomes `pnpm lint && pnpm test:unit` after plan 001)
  - `prepare`: `pnpm -r --filter="./packages/*" run dev:prepare`
  - e2e: `test:e2e`, `test:e2e:dev`, `test:e2e:built` (Playwright, config at `tests/e2e/playwright.config.ts`)
- `tsconfig.json:2` — `"extends": "./packages/devtools/client/.nuxt/tsconfig.json"`
  (generated file; requires `pnpm prepare` first).
- `package.json:6` — `"packageManager": "pnpm@11.12.0"`. Dependency versions are
  pinned via pnpm **catalogs** in `pnpm-workspace.yaml` (`catalog:cli`, `catalog:prod`, etc.).
- Packages: `packages/devtools` (main Nuxt module; server logic in
  `src/server-rpc/**` runs on the Node dev server and is called from the browser
  DevTools client; `client/` is a separate Nuxt app for the UI),
  `packages/devtools-kit` (module-author API, built with `unbuild`),
  `packages/devtools-ui-kit` (Nuxt UI component module).

## Commands you will need

| Purpose | Command       | Expected on success |
|---------|---------------|---------------------|
| Lint    | `pnpm lint`   | exit 0              |

(No install/build required — this plan only adds a Markdown file.)

## Scope

**In scope**:
- `AGENTS.md` (create, repo root)

**Out of scope** (do NOT touch):
- `CONTRIBUTING.md` and anything under `docs/` — the human contributing guide is
  separate (a stale-pnpm-version fix in the docs is out of scope here).
- Any code or config file.

## Git workflow

- Branch: `docs/002-agents-md` off the base branch.
- Conventional Commits. Suggested message: `docs: add root AGENTS.md for contributors and agents`.
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Write `AGENTS.md`

Create `AGENTS.md` at the repo root. It must contain, accurately, at least these
sections (use the facts from "Current state" — do not invent commands):

- **Packages**: one line each for `packages/devtools` (+ its `client/` sub-app and
  `src/server-rpc/` server surface), `packages/devtools-kit`, `packages/devtools-ui-kit`.
- **Setup & build order**: `pnpm install` → `pnpm prepare` (or `pnpm build`) BEFORE
  `pnpm typecheck`, because `tsconfig.json` extends the generated
  `packages/devtools/client/.nuxt/tsconfig.json`.
- **Everyday commands**: `pnpm lint`, `pnpm typecheck`, `pnpm test` (note what it
  runs), `pnpm test:unit`, and the e2e commands (`pnpm test:e2e:dev`).
- **Dependency model**: versions are pinned in `pnpm-workspace.yaml` catalogs;
  add deps as `catalog:<name>` references, not raw versions.
- **Package manager**: pnpm 11 (per `packageManager`).

Keep it concise (roughly 30–60 lines). Do not add emojis.

**Verify**: `test -f AGENTS.md && grep -q "pnpm prepare" AGENTS.md && grep -q "catalog:" AGENTS.md && echo OK` → prints `OK`.

### Step 2: Lint

**Verify**: `pnpm lint` → exit 0. (antfu's config lints Markdown; if it flags the
file, run `pnpm lint --fix` and re-run.)

## Test plan

- No code tests. Verification is the two `grep` checks in Step 1 and a clean lint.

## Done criteria

- [ ] `AGENTS.md` exists at the repo root and documents the prepare-before-typecheck order.
- [ ] `AGENTS.md` mentions the catalog dependency model and the `pnpm test` behavior.
- [ ] `pnpm lint` exits 0.
- [ ] No files outside the in-scope list are modified (`git status`).
- [ ] `plans/README.md` status row for 002 updated.

## STOP conditions

Stop and report if:

- The scripts in `package.json` or the `tsconfig.json` extends target differ from
  the "Current state" excerpts (repo drifted — the doc would be wrong).

## Maintenance notes

- Keep `AGENTS.md` in sync when the build pipeline or top-level scripts change
  (especially after plan 001 lands, which changes `test`).
- The stale human contributing guide (`docs/content/3.development/0.contributing.md`
  still says "pnpm v8") is a separate docs fix, not part of this plan.
