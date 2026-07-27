# Ecosystem dogfooding playground

Dogfoods the Nuxt DevTools integrations of popular Nuxt modules — all in one
combined app — against the **local** `@nuxt/devtools` (this repo's
`packages/devtools`) for integration verification.

Modules covered, in [`modules/`](./modules/), in two groups:

- **Original trio** (kept from the first dogfooding pass; not in nuxt.com's
  "Devtools" category): `nuxt-og-image`, `@nuxt/scripts`, `@nuxt/fonts`.
- **Devtools-category set**, drawn from
  <https://nuxt.com/modules?category=Devtools> and curated down to the ones
  that actually register a DevTools tab: `@nuxt/eslint`, `@nuxt/hints`,
  `@nuxt/a11y`, `@compodium/nuxt`, `@scalar/nuxt`.

Each module has a small fixture in `modules/` so its DevTools surface has real
data to show: `eslint.config.mjs` (ESLint config inspector),
`components/DemoButton.vue` (Compodium's component playground),
`server/api/widgets.get.ts` + `nitro.experimental.openAPI` (Scalar's API
reference), and a deliberate no-`alt` `<img>` in `pages/index.vue` (an axe
finding for `@nuxt/a11y`). See [`REPORTS.md`](./REPORTS.md) for what was
actually found running each of them.

> **Which "Devtools" category modules were left out, and why?** The category
> lists ~18 modules; most don't register a DevTools tab, so there's nothing to
> dogfood against. Skipped as no-surface: `@nuxt/test-utils`,
> `nuxt-typed-router`, `nuxt-prepare`, `nuxt-safe-runtime-config`,
> `nuxt-ssr-api-logger`, `nuxt-email-renderer`. Skipped as secret-gated (need
> auth tokens to do anything): `nuxt-doppler`, `@nuxtjs/ngrok`. Skipped as
> heavy or deprecated: `@nuxtjs/storybook`, `workflow`, `sonda`,
> `@nuxtjs/eslint-module` (superseded by `@nuxt/eslint`).

> Why one combined playground instead of one per module? Grouping keeps the
> review surface small (this repo's own `docs/` app already proves
> `@nuxt/content` + `@nuxt/fonts` + `@nuxt/image` + `nuxt-og-image` coexist
> safely). `@nuxt/content` and `@nuxt/image` were built in and dogfooded in the
> first pass, then dropped once that run showed neither has a DevTools tab to
> test — see [`REPORTS.md`](./REPORTS.md#modules-removed-after-testing) for the
> evidence. `@nuxthub/core` (out of scope) and `@nuxtjs/tailwindcss` (a real
> Tailwind v3-vs-v4 version conflict with `nuxt-og-image`) were dropped before
> implementation. The former standalone "plan 04" doc this all comes from has
> since been retired in favor of this directory being the living
> implementation — see nuxt/devtools#1022 for the full history.

## Opt-in — not part of the main install or CI

This directory is **not** in the root `pnpm-workspace.yaml` `packages:` list,
and `modules/` has its **own** `pnpm-workspace.yaml` + lockfile, sealed off
from the root one. A plain `pnpm install` at the repo root never touches this
directory.

`@nuxt/devtools` in `modules/package.json` is a
`link:../../packages/devtools` dependency — **this repo's own build, never
the npm registry** — so before installing this workspace, make sure the root
one is installed and at least stubbed:

```sh
pnpm install        # repo root, if you haven't already
pnpm run prepare     # stubs packages/devtools/dist (fast; enough to resolve)
pnpm -C playgrounds-ecosystem/modules install
```

(Use `pnpm run build` instead of `prepare` if you want the real static
DevTools client — see below.)

## Running it against the local devtools

```sh
cd playgrounds-ecosystem/modules
NUXT_DEVTOOLS_LOCAL=true pnpm run dev
```

(`dev` already binds to `0.0.0.0` — see `package.json`.)

Omitting `NUXT_DEVTOOLS_LOCAL` still uses this repo's own `@nuxt/devtools`
(via the `link:` dependency above), just without the special
HMR-client-over-a-subprocess wrapper `../../local` provides — it serves
whatever's currently built at `packages/devtools/dist/client`. If that's only
a stub (`pnpm run prepare`), there's no client to serve and DevTools won't
render; run `pnpm run build` at the repo root first to get the real static
client, then this path shows the same UI without the dev-mode HMR overhead —
useful for an A/B comparison against the `NUXT_DEVTOOLS_LOCAL=true` path.

## Opening DevTools and authorizing it

Vite DevTools 0.4 gates its connection behind a one-time authorization:

1. Open the app (`http://localhost:3000/`) in a browser.
2. Click the small floating dock toggle (top-left) — it initially shows an
   amber **"Unauthorized"** badge.
3. Find the line `devframe auth code  NNNNNN` printed in the terminal running
   `nuxt dev`, and type those 6 digits into the prompt (or use the printed
   magic link instead).
4. The dock now shows real entries: **Vite+** (Rolldown), **Nuxt DevTools**,
   **Inspect**, plus a **Settings** cog.

Click the Nuxt-logo entry to open the embedded Nuxt DevTools client. From
there:

- **Overview → `N modules`** lists every installed module with its setup
  time — confirms all ecosystem modules loaded.
- Each module's own tab is **not** in the SideNav's visible icon strip — check
  the **"⋯" overflow menu** at the bottom of the SideNav. That's where the
  module tabs live: `custom-nuxt-seo-og-image`, `custom-nuxt-scripts`,
  `custom-fonts`, `custom-eslint-config`, `custom-hints`, `custom-nuxt-a11y`,
  `custom-compodium`, and `custom-scalar`.

Don't navigate directly to `http://localhost:3000/__nuxt_devtools__/client/`
in a plain tab expecting the same result — that bypasses the RPC handshake the
embedded dock sets up and breaks module detection (see `REPORTS.md`).

## Recording findings

Update [`REPORTS.md`](./REPORTS.md) with what you find: does a module's tab
appear, does it load without console errors, does it show any Plan 00
deprecation diagnostics, and an overall verdict. That report is the raw
material for upstream issues/PRs to each module.

## Automated smoke check (optional, manual trigger only)

`.github/workflows/ecosystem-playground.yml` is `workflow_dispatch`-only — it
installs the root workspace, stubs `packages/devtools` (`pnpm run prepare`),
installs this workspace, and runs `nuxt build` as a cheap "did the module
combo break" signal. It deliberately doesn't run the full `pnpm build` or set
`NUXT_DEVTOOLS_LOCAL` — DevTools no-ops outside `dev` mode, so build-mode
can't exercise anything devtools-specific anyway, and the cheap stub is
enough for the module to resolve. It is **not** part of the default CI path;
trigger it manually from the Actions tab when you want a sanity check without
dogfooding by hand.

## Playwright smoke tests (opt-in)

[`tests/`](./tests/) holds a Playwright suite that boots the combined app and
asserts each Devtools-category module registers its custom tab and that tab
renders against this repo's built devtools client — so "do all the modules'
DevTools still function?" is a one-command check instead of a manual pass.

Unlike the hand-dogfooding runbook above (which uses `NUXT_DEVTOOLS_LOCAL`),
this suite runs against the **built** `@nuxt/devtools` static client — the same
way the repo's main `tests/e2e` suite and CI do — so you must build first.
It's kept **out** of the default `pnpm test:e2e` because it depends on this
sealed, opt-in workspace being installed. Run it explicitly from the repo root:

```sh
pnpm install                                   # repo root
pnpm run build                                 # real static devtools client
pnpm -C playgrounds-ecosystem/modules install  # this sealed workspace
pnpm run test:e2e:ecosystem                    # boots the app + drives devtools
```

The suite spawns its own dev server (on port 13200 by default; override with
`PW_ECOSYSTEM_PORT`) with `VITE_DEVTOOLS_DISABLE_CLIENT_AUTH=true`, so no manual
authorization step is needed. See
[`tests/ecosystem-modules.spec.ts`](./tests/ecosystem-modules.spec.ts) for the
per-module tab assertions.
