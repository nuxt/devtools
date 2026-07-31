# AGENTS.md

Guidance for contributors and AI agents working in this repo.

## High-Level Instructions

- Right now we are working on Nuxt DevTools v4, which is built on top of [Vite DevTools Kit](https://github.com/vitejs/devtools) and [Devframe](https://github.com/devframes/devframe)
- Nuxt DevTools v4 will be default in Nuxt 5, while we it should still work with Nuxt 4.
- There are quite some Nuxt Module built on top of Nuxt DevTools v3's legacy API, we should make sure those modules are still working with Nuxt DevTools v4 (backward compatibility) and provide a migration guide for module authors to migrate to the new vite-devtools-based API.
- Nuxt 5 introduce Nitro v3 (`nitro@3`) while Nuxt 4 is still using Nitro v2 (`nitropack@2`). We should make sure that Nuxt DevTools v4 works with both Nitro v2 and v3, without introduce hard dependency on either of them.

## Packages

- `packages/devtools` — the main Nuxt module. Its `client/` directory is a
  separate Nuxt app that renders the DevTools UI; `src/server-rpc/**` is the
  server surface that runs on the Node dev server and is called from that
  browser client.
- `packages/devtools-kit` — the module-author API, built with `unbuild`.
- `packages/devtools-ui-kit` — a Nuxt UI component module used by the client.

## Everyday commands

| Command               | Purpose                                           |
| --------------------- | ------------------------------------------------- |
| `pnpm lint`           | ESLint over the whole repo                        |
| `pnpm typecheck`      | `vue-tsc --noEmit` (requires prepare/build first) |
| `pnpm test`           | Runs `pnpm lint && pnpm test:unit`                |
| `pnpm test:unit`      | Unit tests via `vitest run`                       |
| `pnpm test:e2e:dev`   | Playwright e2e against the dev server             |
| `pnpm test:e2e:built` | Playwright e2e against a built app                |

(`pnpm test:e2e` runs both the dev and built e2e suites; config lives at
`tests/e2e/playwright.config.ts`.)

## Dependency model

Dependency versions are pinned centrally via pnpm **catalogs** in
`pnpm-workspace.yaml` (e.g. `catalog:cli`, `catalog:prod`, `catalog:frontend`,
`catalog:buildtools`). When adding a dependency, reference it as
`catalog:<name>` in the package's `package.json` rather than pinning a raw
version — add the version to the appropriate catalog in
`pnpm-workspace.yaml` if it isn't there yet.

## Package manager

This repo uses pnpm 11 (see `packageManager` in the root `package.json`). Use
`pnpm`, not `npm` or `yarn`.
