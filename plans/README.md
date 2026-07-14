# Nuxt DevTools × Vite DevTools 0.4 / devframe 0.6 — integration plans

This folder holds three **independently executable** implementation plans. Each
plan is self-contained: a fresh agent with no prior context can pick up any one
file and execute it. Read this overview once for shared context, then follow the
individual plan.

## Background

Nuxt DevTools v4 renders inside **Vite DevTools** (`@vitejs/devtools` 0.4.x),
which is built on the **devframe 0.6** runtime (`@devframes/hub`, plus the
official `@devframes/plugin-terminals` / `@devframes/plugin-messages` /
`@devframes/plugin-inspect` built-ins). The migration to those versions has
already landed on `main` (nuxt/devtools#1010).

Today Nuxt DevTools:

- Registers **one** `type:'iframe'` dock entry (`nuxt:devtools`) that loads the
  whole client (`/__nuxt_devtools__/client/`), with ~25 tabs behind an internal
  `SideNav`. Registration lives in `packages/devtools/src/module-main.ts`
  (~lines 92‑98), inside a Vite DevTools plugin `devtools.setup(ctx)` callback.
- Ships its **own** terminals system (`@xterm` UI, `server-rpc/terminals.ts`,
  `devtools:terminal:*` Nuxt hooks, output-only child processes).
- Ships its **own** ephemeral toast (`devtoolsUiShowNotification` in
  `packages/devtools-ui-kit`), client-only, no history.

These three plans make Nuxt DevTools *use the platform* instead of duplicating
it.

## The three workstreams

| # | Plan | Scope | Risk | Depends on |
|---|------|-------|------|------------|
| 01 | [`01-messages-unification.md`](./01-messages-unification.md) | Route all notifications through the devframe Messages system (`ctx.messages` + the built-in Messages dock); retire the bespoke toast. | Low | none |
| 02 | [`02-terminals-reuse.md`](./02-terminals-reuse.md) | Retire Nuxt's `@xterm` terminals; surface sessions in the built-in Terminals dock via `ctx.terminals`; keep a compat shim for the `devtools:terminal:register` hook. | Medium | none |
| 03 | [`03-dock-groups-presentation.md`](./03-dock-groups-presentation.md) | Introduce a **"Nuxt" dock group** and a general **promote‑tab‑to‑dock** capability; relocate a curated set of tools onto the dock bar. | High (UX) | benefits from 01/02 landing first |

Recommended order: **01 → 02 → 03** (lowest risk first; each de‑risks the next).
They are technically independent and can be built/reviewed as **separate PRs**.

## Shared facts every plan relies on

**Versions** (already in `pnpm-workspace.yaml` catalogs): `@vitejs/devtools`
`^0.4.0`, `@vitejs/devtools-kit` `^0.4.0`, `vite-plugin-inspect` `^12.0.2`,
`vue` `^3.5.39`; transitively `devframe`/`@devframes/hub`/`@devframes/plugin-*`
`0.6.0`.

**Where Nuxt gets the Vite DevTools node context (`ctx`)** — a
`ViteDevToolsNodeContext`, which exposes `ctx.docks`, `ctx.terminals`,
`ctx.messages`, `ctx.commands`, `ctx.rpc`:

- In `packages/devtools/src/module-main.ts`, inside
  `defineViteDevToolsPlugin({ name: 'nuxt:devtools', devtools: { setup(ctx) { … } } })`.
  That callback also calls `connectDevToolsKit?.(ctx)`.
- `connectDevToolsKit` is defined in `packages/devtools/src/server-rpc/index.ts`
  (`setupRPC`), which stores the ctx as `devtoolsKitCtx` and exposes it on the
  Nuxt server context as `ctx.devtoolsKit` (typed in
  `packages/devtools-kit/src/_types/server-ctx.ts` as `DevToolsNodeContext | undefined`).
  So server-side integrations receive `{ devtoolsKit }` and can call
  `devtoolsKit.terminals.*` / `devtoolsKit.messages.*`.

**devframe host APIs (node side)** — from `@devframes/hub` (re-exported by
`@vitejs/devtools-kit`):

```ts
// ctx.terminals: DevframeTerminalsHost
interface DevframeTerminalsHost {
  readonly sessions: Map<string, DevframeTerminalSession>
  readonly events: EventEmitter<{ 'terminal:session:updated': (s) => void }>
  register: (session: DevframeTerminalSession) => DevframeTerminalSession
  update:   (session: DevframeTerminalSession) => void
  startChildProcess: (exec: { command; args; cwd?; env? },
                      terminal: Omit<DevframeTerminalSessionBase,'status'>) => Promise<DevframeChildProcessTerminalSession> // output-only
  startPtySession:   (exec: { command; args?; cwd?; env?; cols?; rows? },
                      terminal: Omit<DevframeTerminalSessionBase,'status'>) => Promise<DevframePtyTerminalSession>          // interactive (zigpty; pipe fallback)
}
// A registered session may carry `buffer?: string[]` and/or `stream?: ReadableStream<string>`.
// child-process sessions are output-only (no write/resize); pty sessions add write(data)+resize(cols,rows).

// ctx.messages: DevframeMessagesHost
interface DevframeMessagesHost {
  readonly entries: Map<string, DevframeMessageEntry>
  info|warn|error|success|debug: (message: string, extra?) => Promise<DevframeMessageHandle>
  add:    (entry: DevframeMessageEntryInput) => Promise<DevframeMessageHandle>
  update: (id, patch) => Promise<DevframeMessageEntry | undefined>
  remove: (id) => Promise<void>
  clear:  () => Promise<void>
}
// DevframeMessageEntry fields incl: message, description?, level('info'|'warn'|'error'|'success'|'debug'),
// stacktrace?, filePosition?, notify?, autoDismiss?, autoDelete?, labels?, category?, from, timestamp, status?
```

**devframe dock API (node side)** — `ctx.docks.register(entry, force?)`:

```ts
// A GROUP is a first-class dock entry:
ctx.docks.register({ id: 'nuxt', type: 'group', title: 'Nuxt', icon: '…', defaultOrder: -900, defaultChildId: 'nuxt:devtools' })
// A member joins by pointing groupId at the group id:
ctx.docks.register({ id: 'nuxt:devtools', type: 'iframe', title: 'Nuxt DevTools', icon: '…', url: '…', groupId: 'nuxt' })
```

- Grouping is a **flat pointer** (`groupId`), one level deep, orphan-tolerant
  (a member whose group never registers renders top-level).
- `category` (`'app' | 'framework' | 'web' | 'advanced' | 'default' | '~builtin' | (string&{})`)
  is a **separate** ordering/bucketing axis, not the grouping mechanism.
- Precedent to copy: Vite DevTools core registers the `~viteplus` group
  (`DEVTOOLS_VITEPLUS_GROUP_ID`, "Vite+") and Rolldown joins it via
  `groupId: DEVTOOLS_VITEPLUS_GROUP_ID`.

**Built-in docks already mounted by `DevTools()`** (Nuxt calls `DevTools()` with
default options, so `builtinDevTools` is on): **Terminals**, **Messages**,
**Inspect** — each `category:'~builtin'`, auto-hidden when empty. Sessions/
messages Nuxt pushes into `ctx.terminals` / `ctx.messages` surface in those
docks for free.

**Hard constraint (Vue DevTools bridge):** only **one** iframe can hold the
Vue DevTools messaging context at a time (`setIframeServerContext(iframe)` is a
single global). The Vue-backed tools (**Pinia**, **Render Tree**) must therefore
stay inside the single hub iframe; they cannot each be a separately-promoted
iframe. (This is the same mechanism as the "Connecting…" fix in
`packages/devtools/src/runtime/plugins/view/client.ts`.)

## Design decisions (locked via a grilling session)

North star: pursue **all** of — discoverability/UX parity, maintenance
reduction, behavioral consistency, and capability upgrade.

Presentation (plan 03):
- **Curated hybrid "Nuxt" dock group**: the hub iframe stays the primary member;
  a small curated set is promoted as sibling dock entries.
- Promotion is a **general opt-in capability** — any tab (core, module, user
  custom) can request a dock button via a flag; ship curated defaults.
- **Type-aware realization**: iframe custom tabs → dock iframe at their own
  `src`; core pages + in-client custom tabs → dock iframe deep-linking into the
  Nuxt client in a **shell-less "dock" mode** (SideNav hidden), one instance per
  promoted tool.
- **Relocating** SideNav semantics: a promoted tool leaves the hub SideNav and
  lives only as a dock button; the SideNav shrinks to non-promoted + Vue tools.
- Vue-bridge tools (Pinia, Render Tree) stay in the hub only.
- Default promoted set: **Components, Server Routes, Pages**.

Terminals (plan 02):
- **Full replacement + compat shim**: retire the `@xterm` UI + `server-rpc/terminals`
  + terminals tab; route sessions through `ctx.terminals` (built-in Terminals
  dock); keep the `devtools:terminal:register` hook as a shim forwarding to
  `ctx.terminals`.
- Capability: **preserve output-only** for existing module terminals (map to
  read-only registered sessions), **add opt-in PTY** for new interactive use.

Messages (plan 01):
- **Unify everything into the devframe Messages system** (one notification
  system). The client toast is re-implemented to push into it.
- **Tiered by intent**: ephemeral client feedback → `notify + autoDismiss +
  autoDelete` (toast-only, no history); server-originated → persisted + leveled.
- **Public notify API** (a `devtools:notify` Nuxt hook and/or
  `useNuxtDevTools().notify()`) forwarded to `ctx.messages`, plus a curated set
  of built-in sources (build/module errors & warnings, server-task results).

## Working agreement

- Base each PR on a fresh branch off `origin/main`.
- Follow the repo's `AGENTS.md`; run `pnpm lint`, `pnpm build`, `pnpm typecheck`,
  and the relevant `pnpm test:e2e` before opening a PR.
- Conventional Commits; one PR per plan; note in the PR body that it was created
  with the help of an agent.
