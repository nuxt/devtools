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

These plans make Nuxt DevTools *use the platform* instead of duplicating it.

## Strategy (this major)

We're cutting a **new major**. Breaking changes are acceptable, but migration
for module authors/users must be **minimal and self-discoverable**, with a
gradual long-term move to devframe-native APIs. Concretely:

1. **Keep** the existing Nuxt DevTools API working.
2. **Expose** the devframe-native API alongside it (connect-safe hosts on
   `nuxt.devtools`).
3. **Soft-deprecate** the Nuxt API where a devframe equivalent exists — via a
   backward-compatible **shim** + a **nostics** deprecation diagnostic (code +
   fix + doc link). **Hard-break only where a faithful shim is infeasible.**
4. Build the feature work (Messages / Terminals / Dock groups) **on top of**
   that foundation.
5. **Dogfood** against real ecosystem modules and produce migration reports.

## Workstreams

| # | Plan | Scope | Risk | Depends on |
|---|------|-------|------|------------|
| 00 | [`00-compat-foundation.md`](./00-compat-foundation.md) | Expose devframe-native API as connect-safe hosts on `nuxt.devtools`; add nostics-driven soft-deprecation (catalog + host registration); establish the shim-first policy + deprecation map. | Medium | none |
| 01 | [`01-messages-unification.md`](./01-messages-unification.md) | Route all notifications through the devframe Messages system (`messages` host + built-in Messages dock); retire the bespoke toast. | Low | 00 |
| 02 | [`02-terminals-reuse.md`](./02-terminals-reuse.md) | Retire Nuxt's `@xterm` terminals; surface sessions in the built-in Terminals dock via the `terminals` host; keep a compat shim for the `devtools:terminal:register` hook. | Medium | 00 |
| 03 | [`03-dock-groups-presentation.md`](./03-dock-groups-presentation.md) | Introduce a **"Nuxt" dock group** and a general **promote‑tab‑to‑dock** capability; relocate a curated set of tools onto the dock bar. | High (UX) | 00 |
| 04 | [`04-ecosystem-playgrounds.md`](./04-ecosystem-playgrounds.md) | `playgrounds-ecosystem/modules/` — one combined playground (og-image, scripts, fonts) linked to local devtools; opt-in install; compat report. **Implemented** — see `playgrounds-ecosystem/REPORTS.md`. | Low | cross-cutting (verifies 00–03) |

Recommended order: **00 → 01 → 02 → 03**, with **04** running alongside as the
dogfooding/verification surface. Each is technically buildable/reviewable as a
**separate PR** (00 first, since 01/02/03 use the surfaces it creates).

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

Foundation (plan 00):
- **Expose devframe-native API** as first-class **connect-safe** hosts on
  `nuxt.devtools` (`docks`/`terminals`/`messages`/`commands`/`diagnostics`),
  queuing pre-connect calls; keep raw `devtoolsKit` as an escape hatch.
- **Self-discoverable deprecations** via a Nuxt **nostics** catalog
  (`defineDiagnostics` + `createConsoleReporter()` + `docsBase` → Nuxt docs),
  **also registered into the DevTools host diagnostics** so they surface inside
  DevTools. Warn-only by default; every code carries `why` + `fix` + doc link.
- **Shim-first**: keep every existing API working this major via shims;
  deprecations are warnings; removal deferred to the next major. **Hard-break
  only where a faithful shim is infeasible** (error-level diagnostic naming the
  replacement).

Ecosystem (plan 04) — **implemented**, see `playgrounds-ecosystem/REPORTS.md`:
- **One combined playground** (`playgrounds-ecosystem/modules/`), not one per
  module, linked to the **local** `@nuxt/devtools`; final set: og-image,
  scripts, fonts (`nuxthub` dropped as out of scope; `tailwindcss` dropped
  after a real version conflict surfaced; `content`/`image` were built in,
  tested, and then dropped once neither turned out to have a DevTools tab to
  test — see the plan file's "Decisions (locked)").
- **Opt-in install / out of main CI**: its own sealed `pnpm-workspace.yaml` +
  lockfile, not in the root `packages:` globs, not run on `postinstall`; an
  optional `workflow_dispatch`-only GH Actions workflow exists for on-demand
  smoke checks.
- **Compatibility report** (`playgrounds-ecosystem/REPORTS.md`) written from
  an actual dogfooding run: all 3 remaining modules have a working DevTools
  tab (all buried in the SideNav overflow menu — a discoverability gap worth
  feeding into this same plan 03); `@nuxt/content` and `@nuxt/image` were
  tested too but removed since neither ships a DevTools tab at all in the
  versions tested — their findings are kept in the report as the evidence.

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
