# Ecosystem dogfooding playground

Dogfoods the Nuxt DevTools integrations of three popular Nuxt modules — all in
one combined app — against the **local** `@nuxt/devtools` (this repo's
`packages/devtools`) for integration verification.

## Layout

| Directory | What it is |
| --- | --- |
| [`modules/`](./modules/) | Multi-module dogfooding app (`nuxt-og-image` + `@nuxt/scripts` + `@nuxt/fonts`) on **Nuxt 4**. See [`REPORTS.md`](./REPORTS.md). |
| [`nuxt4/`](./nuxt4/) | DevTools dogfooding playground on **Nuxt 4** (stable → Nitro v2 / `nitropack`). |
| [`nuxt5/`](./nuxt5/) | DevTools dogfooding playground on **Nuxt 5** (nightly → Nitro v3 / `nitro`). |
| [`scripts/`](./scripts/) | `check-nitro-type-resolution.mjs` — the single-engine type-resolution check (see below). |

### `nuxt4/` + `nuxt5/` — per-major DevTools playgrounds

Minimal apps that dogfood this repo's own `@nuxt/devtools` on each Nuxt major —
which matters because Nuxt 4 ships **Nitro v2** (`nitropack`) and Nuxt 5 ships
**Nitro v3** (`nitro`), and `@nuxt/devtools` / `@nuxt/devtools-kit` now declare
both as *optional* peer dependencies. They're exercised in **`dev`** (the mode
DevTools actually runs in), plus `build` + `typecheck`.

Each is a **sealed pnpm workspace with its own lockfile** (own
`pnpm-workspace.yaml`, like [`modules/`](./modules/)), so a `pnpm install` at
the repo root never touches them. Instead of a `workspace:`/`link:` alias to
source, they install this repo's DevTools from **packed tarballs** — the real
npm install path, from `dist` — the same technique as
[vitejs/devtools' production playground](https://github.com/vitejs/devtools/blob/main/playgrounds/production/README.md).
[`scripts/pack-local.mjs`](./scripts/pack-local.mjs) builds the monorepo and
`pnpm pack`s `@nuxt/devtools` + `@nuxt/devtools-kit` into each playground's own
`.tarballs/` (`pnpm pack` rewrites their `workspace:*` / `catalog:*` protocols
into concrete versions), and each playground's `pnpm-workspace.yaml` points
those two packages at the tarballs via `overrides`.

Why tarballs and not a `link:`? Everything then installs into the playground's
**single** `node_modules`, so the app and DevTools share one Vite /
`@vitejs/devtools` instance — which `nuxi dev` needs. A sealed workspace that
`link:`s the local package instead gives each its own copy (the linked package
resolves its deps from the repo root), and the app's dev SSR ends up
transforming DevTools' whole dependency tree through a second Vite until the
render worker OOMs (`JS heap out of memory`) or drops the socket
(`socket hang up`).

> **Run `setup` first — not a bare `pnpm install`.** The tarballs are
> git-ignored (regenerated from `dist`), so `pnpm install` on a fresh checkout
> can't find `.tarballs/*.tgz` and fails with `ENOENT`. `setup` packs them
> first, then installs.

```sh
# From the playground: build the monorepo, pack DevTools, install (own lockfile)
pnpm -C playgrounds-ecosystem/nuxt5 run setup
pnpm -C playgrounds-ecosystem/nuxt5 run play:dev        # dogfood DevTools (Nuxt 5 / Nitro v3)
pnpm -C playgrounds-ecosystem/nuxt5 run play:build      # + run play:typecheck

pnpm -C playgrounds-ecosystem/nuxt4 run setup           # Nuxt 4 / Nitro v2
pnpm -C playgrounds-ecosystem/nuxt4 run play:dev
```

`run setup` rebuilds + repacks + reinstalls; `run setup:no-build` skips the
rebuild when `dist` is already fresh. After re-packing, pnpm may need
`pnpm install --no-frozen-lockfile --force` to pick up the new tarball.
Open the app, then toggle DevTools (Shift+Alt+D).

### `scripts/check-nitro-type-resolution.mjs` — only-one-engine type check

The playgrounds' DevTools tarball is packed against the repo (where both Nitro
engines are present), so it can't isolate the one-engine-only scenario a
published-npm consumer sees. This script
does, in throwaway temp dirs: it reproduces the shipped `.d.ts` detection with
only one engine symlinked in and asserts that

- only `nitro` → the Nitro types resolve to the concrete **v3** shape,
- only `nitropack` → they resolve to the concrete **v2** shape,
- a naive `NitroV2 | NitroV3` union instead collapses to `any` (why the
  detection exists).

```sh
pnpm install                                             # repo root
node playgrounds-ecosystem/scripts/check-nitro-type-resolution.mjs
```


Modules covered, in [`modules/`](./modules/): `nuxt-og-image`, `@nuxt/scripts`,
`@nuxt/fonts`. See [`REPORTS.md`](./REPORTS.md) for what was actually found
running each of them — including `@nuxt/content` and `@nuxt/image`, which
were tried and then removed: neither registers a DevTools tab in the versions
tested, so there was nothing to dogfood against.

> Why one combined playground instead of one per module, and why only three of
> the originally-considered seven modules? Grouping keeps the review surface
> small (this repo's own `docs/` app already proves `@nuxt/content` +
> `@nuxt/fonts` + `@nuxt/image` + `nuxt-og-image` coexist safely). Two were
> dropped before implementation: `@nuxthub/core` (out of scope) and
> `@nuxtjs/tailwindcss` (a real version conflict — it hard-depends on
> Tailwind v3, while `nuxt-og-image` lists Tailwind v4 as an optional peer).
> Two more, `@nuxt/content` and `@nuxt/image`, were built in and dogfooded
> first, then dropped once that run showed neither has a DevTools tab to test
> — see [`REPORTS.md`](./REPORTS.md#modules-removed-after-testing) for the
> evidence. The former standalone "plan 04" doc this all comes from has since
> been retired in favor of this directory being the living implementation —
> see nuxt/devtools#1022 for the full history.

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
  time — confirms all three ecosystem modules loaded.
- Each module's own tab is **not** in the SideNav's visible icon strip — check
  the **"⋯" overflow menu** at the bottom of the SideNav. As of this report,
  that's where `nuxt-og-image`, `@nuxt/scripts`, and `@nuxt/fonts`'s tabs
  live.

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
