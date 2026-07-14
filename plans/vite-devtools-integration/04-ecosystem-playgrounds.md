# Plan 04 — Ecosystem dogfooding playgrounds

**Status:** ready to execute · **Risk:** low · **Depends on:** nothing (but most
useful once plans 00–03 are in progress, to verify real integrations).
**Outcome:** a `playgrounds-ecosystem/` folder with one playground per popular
Nuxt module that ships a Nuxt DevTools integration, wired to the **local**
`@nuxt/devtools`, for verification + dogfooding — plus a short per-module
**compatibility/migration report** that later seeds an issue/PR to that module.

> Self-contained: read this whole file.

## Why

Popular modules register Nuxt DevTools tabs/RPC (custom iframe tabs, RPC
functions, launch views, etc.). As we (a) migrate to Vite DevTools 0.4 /
devframe 0.6, (b) add the compat foundation (Plan 00), and (c) reshape the dock
(Plan 03), we need to see real integrations render and behave. These playgrounds
are the dogfooding surface and the basis for helping the ecosystem migrate.

## Modules to cover (initial set)

Create one playground per module:

- `nuxt-og-image` / `@nuxtjs/seo` — OG Image playground tab (iframe + interactive)
- `@nuxt/scripts` — Scripts DevTools tab (first-party)
- `@nuxt/content` — Content DevTools tab (collections/DB viewer)
- `@nuxtjs/tailwindcss` — the classic "Tailwind Viewer" iframe custom tab
- `@nuxthub/core` — Hub viewers (DB/KV/Blob), heavier RPC-driven integration
- `@nuxt/fonts` — Fonts module DevTools surface
- `@nuxt/image` — Image module DevTools surface

(Chosen because each exercises a real DevTools integration; `@nuxtjs/tailwindcss`
and `nuxt-og-image` are canonical iframe-tab integrations, `@nuxthub/core` is a
rich RPC one.)

## Decisions (locked)

1. **One playground per module** under `playgrounds-ecosystem/<module>/`.
2. Each links the **local** `@nuxt/devtools` (workspace) so it tests the new
   version — reuse the existing playground convention
   (`const devtoolsModule = process.env.NUXT_DEVTOOLS_LOCAL ? '../../local' : '@nuxt/devtools'`);
   note the relative path is `'../../local'` from `playgrounds-ecosystem/<module>/`
   — verify/point it at the repo's `local` devtools entry used by `playgrounds/*`.
3. **Opt-in install / out of main CI.** These are NOT part of the default
   `pnpm install` or the main CI e2e — they pull heavy third-party deps and
   would bloat install + flake CI. Keep the dep graph isolated so a normal repo
   install is unaffected.
4. **Per-module compatibility report** (a markdown doc) capturing what works /
   breaks / needs migration; later seeds an upstream issue/PR.

## Implementation

### Step 1 — isolate the workspace so the main install stays lean

- Do **not** add `playgrounds-ecosystem/**` to the default `packages:` globs in
  `pnpm-workspace.yaml` (which currently lists `packages/**` and `playgrounds/**`).
  Options, pick one:
  - **Separate opt-in workspace file / script** that installs the ecosystem set
    on demand (e.g. a `pnpm -C playgrounds-ecosystem/<module> install` per
    playground, each with its own lockfile), or
  - a dedicated `pnpm-workspace.ecosystem.yaml` + an npm script
    (`pnpm run ecosystem:install`) that a contributor runs explicitly.
- Each playground links the local devtools. Confirm how `playgrounds/*` resolve
  `'../../local'` (the repo exposes a `local` Nuxt module entry for the built
  `@nuxt/devtools`); replicate that resolution from the deeper
  `playgrounds-ecosystem/<module>/` path (likely `'../../local'` still resolves
  to `<repo>/local` — verify the depth).

### Step 2 — scaffold each playground

For each module, a minimal Nuxt app:

- `playgrounds-ecosystem/<module>/package.json` — `nuxt`, the target module (pin
  a known-good version), and a `dev`/`build` script. Bind dev to `0.0.0.0` for
  remote preview (`nuxi dev --host 0.0.0.0`).
- `nuxt.config.ts` — `modules: [devtoolsModule, '<module>']`, plus the minimal
  module config needed to activate its DevTools integration (e.g. tailwind needs
  a config; content needs a `content/` dir; og-image needs a route with OG tags;
  nuxthub needs its bindings/config).
- Just enough app content to make the integration light up (a page, a component,
  sample content, etc.).

### Step 3 — a per-module compatibility report

- `playgrounds-ecosystem/<module>/COMPAT.md` (or a shared
  `playgrounds-ecosystem/REPORTS.md`) recording, per module:
  - Does the module's DevTools tab/entry appear? (in the hub SideNav and/or, if
    the module opts into `dock:true` from Plan 03, as a dock button)
  - Does its RPC / iframe view load without console errors under Vite DevTools
    0.4 / devframe 0.6?
  - Any use of deprecated Nuxt DevTools APIs (surfaced by the Plan 00 nostics
    deprecation diagnostics) — capture the codes shown.
  - Verdict: works as-is / works via shim (with deprecation) / broken + required
    migration steps.
- These reports are the raw material for upstream issues/PRs to each module.

### Step 4 — a dogfooding runbook

- `playgrounds-ecosystem/README.md`: how to install (opt-in), run a single
  playground against the local devtools, and where to record findings. Include
  the `agent-browser`/manual steps to open Vite DevTools and exercise each
  integration.

## Acceptance criteria

- `playgrounds-ecosystem/<module>/` exists for each of the 7 modules, each
  runnable with the local `@nuxt/devtools` and its DevTools integration visibly
  active.
- A normal `pnpm install` at the repo root is **unaffected** (ecosystem deps are
  opt-in, not pulled by default; main CI unchanged).
- Each playground has a compatibility report with a clear verdict.
- Running any one playground surfaces (via Plan 00 diagnostics) whether the
  module uses deprecated APIs.

## Risks / gotchas

- **Dependency bloat / lockfile churn.** Keep ecosystem deps out of the default
  workspace + lockfile; isolate per playground so the core repo install stays
  lean and reproducible.
- **Module config specifics.** Some integrations only activate with real config
  (tailwind config, content dir, nuxthub bindings, og-image routes) — scaffold
  the minimum to trigger each DevTools surface.
- **Version drift.** Pin each module to a known version in its playground; note
  the version in the report so upstream fixes can be tracked.
- **Local-devtools resolution.** Verify the `'../../local'` link resolves from
  the extra directory depth; adjust the relative path if
  `playgrounds-ecosystem/<module>/` is one level deeper than `playgrounds/<name>/`.
- **Not a CI gate (yet).** These are manual dogfooding surfaces; if we later want
  automated smoke coverage, add a separate optional workflow (kept off the
  critical path).
