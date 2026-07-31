# Ecosystem dogfooding playgrounds

Playgrounds that dogfood **this repo's** `@nuxt/devtools` (never the registry
copy) against real apps. Opt-in: none of them are in the root
`pnpm-workspace.yaml`, so a `pnpm install` at the repo root never touches them.

| Directory | What it is |
| --- | --- |
| [`nuxt4/`](./nuxt4/) | DevTools on **Nuxt 4** (Nitro v2 / `nitropack`). |
| [`nuxt5/`](./nuxt5/) | DevTools on **Nuxt 5** nightly (Nitro v3 / `nitro`). |
| [`modules/`](./modules/) | Combined app dogfooding eight ecosystem modules' DevTools tabs on Nuxt 4. |
| [`tests/`](./tests/) | Opt-in Playwright suite that drives `modules/`'s DevTools tabs. |
| [`scripts/`](./scripts/) | `pack-local.mjs` (packs DevTools tarballs), `check-nitro-type-resolution.mjs`. |

Findings go in [`REPORTS.md`](./REPORTS.md).

## `nuxt4/` + `nuxt5/`

One minimal app per Nuxt major, because Nuxt 4 ships Nitro v2 and Nuxt 5 ships
Nitro v3, and `@nuxt/devtools` / `@nuxt/devtools-kit` declare both as *optional*
peers. Each is a sealed pnpm workspace with its own lockfile, and installs
DevTools from **packed tarballs** — the real npm install path, from `dist`.

```sh
# Build the monorepo, pack DevTools into .tarballs/, install
pnpm -C playgrounds-ecosystem/nuxt5 run setup
pnpm -C playgrounds-ecosystem/nuxt5 run dev        # the mode DevTools runs in
pnpm -C playgrounds-ecosystem/nuxt5 run build
pnpm -C playgrounds-ecosystem/nuxt5 run typecheck

pnpm -C playgrounds-ecosystem/nuxt4 run setup      # same, Nuxt 4 / Nitro v2
```

Run `setup`, not a bare `pnpm install` — the tarballs are git-ignored, so a
fresh checkout fails with `ENOENT` on `.tarballs/*.tgz`. After re-packing, pnpm
may need `pnpm install --no-frozen-lockfile --force` to pick up the new tarball.

Why tarballs and not `link:`? Everything lands in the playground's *single*
`node_modules`, so app and DevTools share one Vite / `@vitejs/devtools`
instance, which `nuxi dev` needs. With a `link:`, the linked package resolves
its deps from the repo root, dev SSR transforms DevTools' whole dependency tree
through a second Vite, and the render worker OOMs (`JS heap out of memory`) or
drops the socket (`socket hang up`). Same technique as
[vitejs/devtools' production playground](https://github.com/vitejs/devtools/blob/main/playgrounds/production/README.md).

## `modules/`

One combined app dogfooding the DevTools integrations of popular Nuxt modules,
in two groups:

- **Original trio** (kept from the first dogfooding pass; not in nuxt.com's
  "Devtools" category): `nuxt-og-image`, `@nuxt/scripts`, `@nuxt/fonts`.
- **Devtools-category set**, drawn from
  <https://nuxt.com/modules?category=Devtools> and curated down to the ones
  that actually register a DevTools tab: `@nuxt/eslint`, `@nuxt/hints`,
  `@nuxt/a11y`, `@compodium/nuxt`, `@scalar/nuxt`.

Each module has a small fixture so its DevTools surface has real data to show:
`eslint.config.mjs` (ESLint config inspector), `components/DemoButton.vue`
(Compodium's component playground), `server/api/widgets.get.ts` +
`nitro.experimental.openAPI` (Scalar's API reference), and a deliberate
no-`alt` `<img>` in `pages/index.vue` (an axe finding for `@nuxt/a11y`).

Also a sealed workspace, but `@nuxt/devtools` is a
`link:../../packages/devtools` dependency, so the root workspace must be
installed and at least stubbed first:

```sh
pnpm install                                    # repo root
pnpm run prepare                                # stubs packages/devtools/dist
pnpm -C playgrounds-ecosystem/modules install

cd playgrounds-ecosystem/modules
NUXT_DEVTOOLS_LOCAL=true pnpm run dev
```

Without `NUXT_DEVTOOLS_LOCAL` it still uses this repo's DevTools, just serving
whatever is built at `packages/devtools/dist/client` instead of the HMR client
wrapper. A `prepare` stub has no client to serve, so DevTools won't render —
run `pnpm run build` at the repo root for the real static client (useful as an
A/B against the `NUXT_DEVTOOLS_LOCAL=true` path).

### What's deliberately left out, and why

The "Devtools" category lists ~18 modules; most don't register a DevTools tab,
so there's nothing to dogfood against. Skipped as no-surface: `@nuxt/test-utils`,
`nuxt-typed-router`, `nuxt-prepare`, `nuxt-safe-runtime-config`,
`nuxt-ssr-api-logger`, `nuxt-email-renderer`. Skipped as secret-gated (need auth
tokens to do anything): `nuxt-doppler`, `@nuxtjs/ngrok`. Skipped as heavy or
deprecated: `@nuxtjs/storybook`, `workflow`, `sonda`, `@nuxtjs/eslint-module`
(superseded by `@nuxt/eslint`).

Outside that category, coverage was trimmed deliberately too: `@nuxt/content`
and `@nuxt/image` were dogfooded in the first pass and dropped (no DevTools tab
to test — see [`REPORTS.md`](./REPORTS.md#modules-removed-after-testing)),
`@nuxthub/core` was out of scope, and `@nuxtjs/tailwindcss` conflicts (Tailwind
v3 vs `nuxt-og-image`'s optional v4 peer). One combined app rather than one per
module keeps the review surface small — this repo's own `docs/` app already
proves `@nuxt/content` + `@nuxt/fonts` + `@nuxt/image` + `nuxt-og-image` coexist
safely. History: nuxt/devtools#1022.

## Opening DevTools

Vite DevTools 0.4 gates the connection behind a one-time authorization: open
the app, click the floating dock toggle (top-left, shows an amber
**"Unauthorized"** badge), and enter the 6-digit `devframe auth code NNNNNN`
printed by `nuxt dev` (or use the magic link). Then click the Nuxt-logo entry
for the embedded client.

- **Overview → `N modules`** confirms every module loaded, with setup times.
- Module tabs live in the **"⋯" overflow menu** at the bottom of the SideNav,
  not the visible icon strip. That's where `custom-nuxt-seo-og-image`,
  `custom-nuxt-scripts`, `custom-fonts`, `custom-eslint-config`,
  `custom-hints`, `custom-nuxt-a11y`, `custom-compodium`, and `custom-scalar`
  live.
- Don't open `/__nuxt_devtools__/client/` directly — that bypasses the RPC
  handshake and breaks module detection (see `REPORTS.md`).

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

## `scripts/check-nitro-type-resolution.mjs`

The playgrounds are packed against a repo where *both* Nitro engines exist, so
they can't reproduce what a published-npm consumer with only one sees. This
script does, in throwaway temp dirs, asserting that:

- only `nitro` → Nitro types resolve to the concrete **v3** shape,
- only `nitropack` → the concrete **v2** shape,
- a naive `NitroV2 | NitroV3` union collapses to `any` (why the detection exists).

```sh
pnpm install                                             # repo root
node playgrounds-ecosystem/scripts/check-nitro-type-resolution.mjs
```

## CI

`.github/workflows/ecosystem-playground.yml` is `workflow_dispatch`-only and
holds two independent jobs. Neither is part of the default push / pull_request
CI path; trigger them from the Actions tab.

- **`smoke`** — root install → `pnpm run build` → pack the DevTools tarballs →
  `check-nitro-type-resolution.mjs` → `typecheck` + `build` the `nuxt4/` and
  `nuxt5/` playgrounds → `nuxt build` the `modules/` combo. A cheap "did any of
  this break" signal. It doesn't set `NUXT_DEVTOOLS_LOCAL`, since DevTools
  no-ops outside `dev` mode — build-mode can't exercise anything
  devtools-specific anyway.
- **`devtools-smoke`** — the heavier job that actually drives the embedded
  DevTools client: full `pnpm build` (real static client), Playwright's
  Chromium, then the smoke suite (`pnpm run test:e2e:ecosystem`, see
  [Playwright smoke tests](#playwright-smoke-tests-opt-in)). On failure it
  uploads the Playwright HTML report as an artifact.
