# Plan 04 — Ecosystem dogfooding playgrounds

**Status:** implemented (see `playgrounds-ecosystem/`) · **Risk:** low ·
**Depends on:** nothing (but most useful once plans 00–03 are in progress, to
verify real integrations).
**Outcome:** a `playgrounds-ecosystem/` folder with one combined playground
covering five popular Nuxt modules that ship (or were expected to ship) a
Nuxt DevTools integration, wired to the **local** `@nuxt/devtools`, for
verification + dogfooding — plus a **compatibility/migration report**
(`playgrounds-ecosystem/REPORTS.md`) that later seeds an issue/PR to each
module.

> Self-contained: read this whole file.

## Why

Popular modules register Nuxt DevTools tabs/RPC (custom iframe tabs, RPC
functions, launch views, etc.). As we (a) migrate to Vite DevTools 0.4 /
devframe 0.6, (b) add the compat foundation (Plan 00), and (c) reshape the dock
(Plan 03), we need to see real integrations render and behave. This playground
is the dogfooding surface and the basis for helping the ecosystem migrate.

## Modules covered

One combined playground, `playgrounds-ecosystem/modules/`, running all five
together:

- `nuxt-og-image` — OG Image DevTools tab
- `@nuxt/scripts` — Scripts DevTools tab (first-party)
- `@nuxt/content` — content collections/DB
- `@nuxt/fonts` — Fonts module DevTools surface
- `@nuxt/image` — image optimization

Two modules originally considered were dropped before implementation (see
"Decisions (locked)" below): `@nuxthub/core` (out of scope, per explicit
direction) and `@nuxtjs/tailwindcss` (a real version conflict with
`nuxt-og-image`'s optional Tailwind peer — see below).

**Reality check from actually running this (full findings in
[`REPORTS.md`](../../playgrounds-ecosystem/REPORTS.md)):** of the five,
`nuxt-og-image`, `@nuxt/scripts`, and `@nuxt/fonts` do register a working
DevTools custom tab (tucked in the SideNav's overflow menu). `@nuxt/content`
3.15.0 and `@nuxt/image` 2.0.0 currently register **no** DevTools tab at all —
this plan's original assumption that every "popular module" still ships one
doesn't hold for those two majors. That's a real, reportable finding in its
own right, not a scaffolding failure.

## Decisions (locked)

These were decided in a grilling session that deviated from this plan's
original shape (originally: one playground *per* module, 7 modules including
`@nuxthub/core` and `@nuxtjs/tailwindcss`). What's below is what actually
shipped:

1. **One combined playground**, not one per module — `playgrounds-ecosystem/modules/`.
   Grouping keeps the review surface small; the modules chosen have no
   runtime conflicts (this repo's own `docs/` app already proves
   `@nuxt/content` + `@nuxt/fonts` + `@nuxt/image` + `nuxt-og-image` coexist
   safely; `@nuxt/scripts` is a low-risk addition).
2. **`@nuxthub/core` dropped** — out of scope for this iteration (heavier
   `wrangler`/bindings footprint than the rest; explicitly deferred, not
   attempted).
3. **`@nuxtjs/tailwindcss` dropped** — real version conflict found before
   implementation: `@nuxtjs/tailwindcss` hard-depends on Tailwind **v3**
   (`~3.4.17`), while `nuxt-og-image` lists Tailwind **v4** (`^4.0.0`) as an
   *optional* peer (only used if you opt into Tailwind-styled OG templates via
   satori). Rather than accept the unmet-peer tension, `@nuxtjs/tailwindcss`
   was dropped entirely, at the cost of losing the canonical "Tailwind Viewer"
   iframe-tab example from this playground.
4. **Sealed opt-in workspace.** `playgrounds-ecosystem/modules/` has its
   **own** `pnpm-workspace.yaml` (`packages: - .`) and its own committed
   lockfile — same pattern this repo already uses for `docs/`. Confirmed by a
   sandbox test that *without* a workspace-root file of its own, `pnpm
   install` inside a nested directory silently walks up and writes into the
   **parent's** lockfile — exactly the churn this needs to avoid. It is
   **not** listed in the root `pnpm-workspace.yaml`'s `packages:` globs and is
   **not** part of `postinstall` (unlike `docs/`, which *is* auto-installed on
   `postinstall` — this is deliberately more opt-in than that).
5. **`@nuxt/content` uses the native `node:sqlite` connector**
   (`experimental.sqliteConnector: 'native'`), not `better-sqlite3` — avoids a
   native build step entirely (Node ≥ 22.5 has it built in).
6. **`@nuxt/scripts` demo uses `useScriptNpm` (`js-confetti`, `bundle: true`)**,
   not a registry analytics script — no third-party runtime network
   dependency (analytics CDNs), only a one-time build-time fetch from npm/unpkg
   that gets bundled, which is more reliable for both local dogfooding and the
   optional CI smoke workflow below.
7. **No root `package.json` changes.** Only one playground exists; a
   root-level convenience script would be ceremony for a one-line command.
   Install/run instructions live entirely in
   [`playgrounds-ecosystem/README.md`](../../playgrounds-ecosystem/README.md).
8. **Compat report at `playgrounds-ecosystem/REPORTS.md`**, one level up from
   the playground (not a per-module `COMPAT.md`, since there's only one
   playground now).
9. **An optional, `workflow_dispatch`-only GitHub Actions workflow**
   (`.github/workflows/ecosystem-playground.yml`) installs the workspace and
   runs `nuxt build` as a manually-triggered "does the 5-module combo still
   build" smoke check. It runs against the **published** `@nuxt/devtools`,
   deliberately — Nuxt DevTools no-ops entirely outside `dev` mode
   (`packages/devtools/src/module-main.ts`, bails when `!nuxt.options.dev`),
   so a `build` with `NUXT_DEVTOOLS_LOCAL=true` wouldn't exercise anything
   devtools-specific anyway; that mismatch was caught and corrected before
   merging this plan. It is **not** part of the default `push`/`pull_request`
   CI path.

## Implementation (as built)

### Workspace isolation

`playgrounds-ecosystem/modules/pnpm-workspace.yaml`:

```yaml
packages:
  - .
strictPeerDependencies: false
autoInstallPeers: true
shamefullyHoist: true
```

Install explicitly with `pnpm -C playgrounds-ecosystem/modules install` — this
is never invoked automatically by the root install or `postinstall`.

### The playground app

`playgrounds-ecosystem/modules/nuxt.config.ts` wires up all five modules plus
the local-vs-published devtools toggle, reusing the exact convention from
`playgrounds/*`:

```ts
const devtoolsModule = process.env.NUXT_DEVTOOLS_LOCAL ? '../../local' : '@nuxt/devtools'
```

`'../../local'` resolves correctly: `playgrounds-ecosystem/modules/` sits at
the same depth below the repo root as `playgrounds/<name>/` (two directories
down either way), so no extra `../` was needed despite the longer-looking
`playgrounds-ecosystem` segment name.

One page (`pages/index.vue`) exercises all five: renders a `@nuxt/content`
collection, applies a custom self-hosted font via `@nuxt/fonts`, serves an
image through `<NuxtImg>` (`@nuxt/image`), loads `js-confetti` via
`@nuxt/scripts`' `useScriptNpm`, and gets a zero-config OG image from
`nuxt-og-image` via `useSeoMeta`.

### The compatibility report

[`playgrounds-ecosystem/REPORTS.md`](../../playgrounds-ecosystem/REPORTS.md) —
written from an actual run: installed the workspace, started
`NUXT_DEVTOOLS_LOCAL=true nuxi dev`, drove a real Chromium instance
(`agent-browser`) through the Vite DevTools authorization flow (entering the
`devframe auth code` printed in the terminal) and into the embedded DevTools
client, and recorded exactly what rendered, what didn't, and why — including a
concrete discoverability gap (all five modules' tabs are buried in the
SideNav's overflow menu) worth feeding into Plan 03.

### The dogfooding runbook

[`playgrounds-ecosystem/README.md`](../../playgrounds-ecosystem/README.md) —
install/run instructions, how to get past the Vite DevTools authorization
prompt, where each module's tab actually lives in the UI, and a warning against
navigating directly to `/__nuxt_devtools__/client/` (breaks the RPC handshake
and produces a false "0 modules" reading).

## Acceptance criteria

- [x] `playgrounds-ecosystem/modules/` exists, runnable with the local
  `@nuxt/devtools`, with three of the five modules' DevTools integrations
  visibly active (the other two have none to activate, per `REPORTS.md`).
- [x] A normal `pnpm install` at the repo root is **unaffected** (the
  ecosystem workspace is opt-in, sealed off by its own
  `pnpm-workspace.yaml` + lockfile; main CI unchanged).
- [x] A compatibility report exists with a clear, evidenced verdict per
  module.
- [x] Running the playground surfaced real, actionable findings (2 of 5
  modules have no DevTools tab in their current major version; the working
  three are only reachable via the SideNav overflow menu) — richer than the
  original "deprecated API usage" framing, since Plan 00's nostics
  deprecation diagnostics don't exist yet on `main` at the time of this run.

## Risks / gotchas

- **Dependency bloat / lockfile churn.** Mitigated: the ecosystem workspace's
  lockfile lives at `playgrounds-ecosystem/modules/pnpm-lock.yaml`, sealed off
  from the root by its own `pnpm-workspace.yaml` — confirmed by direct test
  that this is required (see Decision 4 above).
- **Module config specifics.** Handled per module (native sqlite connector for
  content, `bundle: true` npm script for scripts, a self-hosted custom font
  for fonts, a served/optimized sample image for image, zero-config OG image
  for og-image).
- **Version drift.** Each module is pinned via a direct caret range in
  `playgrounds-ecosystem/modules/package.json`; exact resolved versions are
  recorded at the top of `REPORTS.md`.
- **Real version conflicts surfaced *before* implementation, not after** —
  `@nuxtjs/tailwindcss` (Tailwind v3) vs. `nuxt-og-image`'s optional Tailwind
  v4 peer. Resolved by dropping `@nuxtjs/tailwindcss` rather than accepting an
  unmet-peer workaround.
- **Local-devtools resolution.** Verified: `'../../local'` resolves correctly
  from `playgrounds-ecosystem/modules/` (same depth as `playgrounds/<name>/`).
- **Not a CI gate.** `.github/workflows/ecosystem-playground.yml` is
  `workflow_dispatch`-only, deliberately off the default `push`/`pull_request`
  path — a human triggers it on demand.
