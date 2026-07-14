# AGENTS.md

Guidance for contributors and AI agents working in this repo.

## Packages

- `packages/devtools` — the main Nuxt module. Its `client/` directory is a
  separate Nuxt app that renders the DevTools UI; `src/server-rpc/**` is the
  server surface that runs on the Node dev server and is called from that
  browser client.
- `packages/devtools-kit` — the module-author API, built with `unbuild`.
- `packages/devtools-ui-kit` — a Nuxt UI component module used by the client.

## Setup & build order

```
pnpm install
pnpm prepare   # or: pnpm build
```

Run `pnpm prepare` (or `pnpm build`) **before** `pnpm typecheck`. The root
`tsconfig.json` extends a generated file,
`packages/devtools/client/.nuxt/tsconfig.json`, which only exists after Nuxt
has prepared the client app. On a fresh clone, `pnpm typecheck` fails until
this has run.

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
