# Ecosystem dogfooding playgrounds

Playgrounds that dogfood **this repo's** `@nuxt/devtools` (never the registry
copy) against real apps. Opt-in: none of them are in the root
`pnpm-workspace.yaml`, so a `pnpm install` at the repo root never touches them.

| Directory | What it is |
| --- | --- |
| [`nuxt4/`](./nuxt4/) | DevTools on **Nuxt 4** (Nitro v2 / `nitropack`). |
| [`nuxt5/`](./nuxt5/) | DevTools on **Nuxt 5** nightly (Nitro v3 / `nitro`). |
| [`modules/`](./modules/) | Combined app dogfooding `nuxt-og-image` + `@nuxt/scripts` + `@nuxt/fonts` on Nuxt 4. |
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

Module coverage was trimmed deliberately: `@nuxt/content` and `@nuxt/image`
were dogfooded and dropped (no DevTools tab to test — see
[`REPORTS.md`](./REPORTS.md#modules-removed-after-testing)), `@nuxthub/core` was
out of scope, and `@nuxtjs/tailwindcss` conflicts (Tailwind v3 vs `nuxt-og-image`'s
optional v4 peer). History: nuxt/devtools#1022.

## Opening DevTools

Vite DevTools 0.4 gates the connection behind a one-time authorization: open
the app, click the floating dock toggle (top-left, shows an amber
**"Unauthorized"** badge), and enter the 6-digit `devframe auth code NNNNNN`
printed by `nuxt dev` (or use the magic link). Then click the Nuxt-logo entry
for the embedded client.

- **Overview → `N modules`** confirms every module loaded, with setup times.
- Module tabs live in the **"⋯" overflow menu** at the bottom of the SideNav,
  not the visible icon strip.
- Don't open `/__nuxt_devtools__/client/` directly — that bypasses the RPC
  handshake and breaks module detection (see `REPORTS.md`).

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

`.github/workflows/ecosystem-playground.yml` is `workflow_dispatch`-only: root
install → `pnpm run prepare` stub → install `modules/` → `nuxt build`, as a
cheap "did the module combo break" signal. It skips the full build and
`NUXT_DEVTOOLS_LOCAL` since DevTools no-ops outside `dev` mode. Trigger it from
the Actions tab.
