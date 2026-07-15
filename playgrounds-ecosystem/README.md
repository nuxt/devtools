# Ecosystem dogfooding playground

Dogfoods the Nuxt DevTools integrations of three popular Nuxt modules — all in
one combined app — against the **local** `@nuxt/devtools` (this repo's
`packages/devtools`), for verification while working through
[`plans/vite-devtools-integration/`](../plans/vite-devtools-integration/).

Modules covered, in [`modules/`](./modules/): `nuxt-og-image`, `@nuxt/scripts`,
`@nuxt/fonts`. See [`REPORTS.md`](./REPORTS.md) for what was actually found
running each of them — including `@nuxt/content` and `@nuxt/image`, which
were tried and then removed: neither registers a DevTools tab in the versions
tested, so there was nothing to dogfood against.

> Why one combined playground instead of one per module, and why only three of
> the originally-considered seven modules? See the "locked decisions" note in
> [`plans/vite-devtools-integration/04-ecosystem-playgrounds.md`](../plans/vite-devtools-integration/04-ecosystem-playgrounds.md#decisions-locked).

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
