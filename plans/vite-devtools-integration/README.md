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

The **compatibility & deprecation foundation** these plans were originally going
to build has **also already landed** — nuxt/devtools#1021 (server-side) and
nuxt/devtools#1023 (client-side). See ["Landed foundation"](#landed-foundation)
below; that section is now the shared ground these plans stand on (there is no
longer a separate "plan 00" — it shipped).

Today Nuxt DevTools:

- Registers **one** `type:'iframe'` dock entry (`nuxt:devtools`) that loads the
  whole client (`/__nuxt_devtools__/client/`), with ~25 tabs behind an internal
  `SideNav`. Registration lives in `packages/devtools/src/module-main.ts`
  (inside a Vite DevTools plugin `devtools.setup(ctx)` callback, ~lines 95‑112).
- Ships its **own** terminals system (`@xterm` UI, `server-rpc/terminals.ts`,
  `devtools:terminal:*` Nuxt hooks, output-only child processes).
- Ships its **own** ephemeral toast (`devtoolsUiShowNotification` in
  `packages/devtools-ui-kit`), client-only, no history.

These plans make Nuxt DevTools *use the platform* instead of duplicating it.

## Strategy (this major)

We're cutting a **new major**. Breaking changes are acceptable, but migration
for module authors/users must be **minimal and self-discoverable**, with a
gradual long-term move to devframe-native APIs. Concretely:

1. **Keep** the existing Nuxt DevTools API working (via shims).
2. **Expose** the devframe-native API — done: modules reach the connected
   `ViteDevToolsNodeContext` through the `devtools:ready` hook / `onDevtoolsReady`
   (server) and `onDevtoolsReady` from `@nuxt/devtools-kit/iframe-client` +
   `client.devtools.devtoolsKit` (client).
3. **Soft-deprecate** the Nuxt API where a devframe equivalent exists — via a
   backward-compatible **shim** + a **nostics** deprecation diagnostic (code +
   fix + doc link). This mechanism has shipped (see below).
4. Build the feature work (Messages / Terminals / Dock groups) **on top of**
   that foundation.

## Landed foundation

The foundation these plans depend on is **already implemented** — do **not**
rebuild it. Build the feature plans on top of it.

### Reaching the connected context

**Server side** — `onDevtoolsReady((ctx) => …)` (from `@nuxt/devtools-kit`,
backed by the `devtools:ready` Nuxt hook) runs once the Vite DevTools kit has
connected and hands you the connected `ViteDevToolsNodeContext`, exposing
`ctx.docks`, `ctx.terminals`, `ctx.messages`, `ctx.commands`, `ctx.rpc`, and
`ctx.diagnostics`:

```ts
import { onDevtoolsReady } from '@nuxt/devtools-kit'

onDevtoolsReady((ctx) => {
  ctx.docks.register({ id: 'my-module', type: 'iframe', title: 'My Module', url: '/…' })
})
```

This is the **recommended entry point** — the kit is guaranteed available, so
there is **no pre-connect timing problem and no queue to manage**. (Earlier
drafts proposed "connect-safe host accessors" on `nuxt.devtools` with an internal
queue; those were **not** built and the ready hook supersedes them.) The raw
`nuxt.devtools.devtoolsKit` (`ViteDevToolsNodeContext | undefined` until connect)
remains the escape hatch. Wiring lives in
`packages/devtools/src/server-rpc/index.ts` (`connectDevToolsKit` fires
`devtools:ready`).

**Client side** (nuxt/devtools#1023) — `onDevtoolsReady((kit) => …)` from
`@nuxt/devtools-kit/iframe-client` mirrors the server hook and hands back the
connected `DevToolsRpcClient`. `client.devtools.devtoolsKit` is that same
connected client (mirror of `nuxt.devtools.devtoolsKit`), giving full
devframe-native client access (register client RPC, call server functions,
shared state, streaming) with **no** `@vitejs/devtools-kit/client` import:

```ts
import { onDevtoolsReady } from '@nuxt/devtools-kit/iframe-client'

onDevtoolsReady((kit) => {
  kit.client.register({ name: 'my-module:on-update', type: 'event', handler })
})
```

### nostics deprecation system (shipped)

`packages/devtools-kit/src/diagnostics.ts` implements the deprecation engine:

- A `diagnosticCodes` catalog + `consoleDiagnostics` standalone reporter (prints
  to the terminal pre-connect), and `registerHostDiagnostics(ctx)` which also
  registers the codes into the DevTools **diagnostics host** post-connect so they
  surface inside DevTools.
- `deprecate(nuxt, code, params, { key?, method? })` — emits once per
  `code:key` (deduped), routing to the host catalog when connected and the
  console catalog otherwise. `method: 'error'` for hard breaks; default `'warn'`.
- `docsBase` resolves to a per-code migration-guide anchor:
  `https://devtools.nuxt.com/module/migration-v4#<code>`.

**Codes already allocated** (extend by appending to `diagnosticCodes`; give each
new code a migration-guide anchor):

| Code | Deprecated API | Replacement |
|---|---|---|
| `NDT_DEP_0001` | `startSubprocess().getProcess()` | `getResult()` |
| `NDT_DEP_0002` | *retired* (`disableAuthorization` is now a supported option) | — |
| `NDT_DEP_0003` | `extendServerRpc` | `onDevtoolsReady((ctx) => ctx.rpc.register(defineRpcFunction(...)))` |
| `NDT_DEP_0004` | `startSubprocess` | `onDevtoolsReady((ctx) => ctx.terminals.startChildProcess(...))` |
| `NDT_DEP_0005` | `addCustomTab` | `onDevtoolsReady((ctx) => ctx.docks.register(...))` |
| `NDT_DEP_0006` | `refreshCustomTabs` | update via the `ctx.docks.register(...)` handle |
| `NDT_DEP_0007` | direct `nuxt.devtools.rpc` (`broadcast`/`functions`) | the connected `ctx.rpc` from `onDevtoolsReady` |
| `extendClientRpc` (client) | deprecated in #1023 | `onDevtoolsReady((kit) => kit.client.register(...))` |

These shims **already ship** — `addCustomTab` / `refreshCustomTabs` /
`startSubprocess` / `extendServerRpc` all still work and merely warn. New
deprecations added by the plans below use `deprecate(...)` with the **next free**
`NDT_DEP_xxxx` code (don't reuse `0002`).

> **Note — `disableAuthorization`.** An earlier draft wanted to hard-break this
> option with an error-level diagnostic. That was reversed: it is now a
> **supported first-class option** (`ModuleOptions.disableAuthorization`,
> mapped to Vite's `devtools.clientAuth = false`; default `isSandboxed`). Do
> **not** deprecate it.

## Workstreams

| # | Plan | Scope | Risk | Depends on |
|---|------|-------|------|------------|
| 01 | [`01-messages-unification.md`](./01-messages-unification.md) | Route all notifications through the devframe Messages system (`ctx.messages` + built-in Messages dock); retire the bespoke toast. | Low | landed foundation |
| 02 | [`02-terminals-reuse.md`](./02-terminals-reuse.md) | Retire Nuxt's `@xterm` terminals; surface sessions in the built-in Terminals dock via `ctx.terminals`; keep a compat shim for the `devtools:terminal:register` hook. | Medium | landed foundation |
| 03 | [`03-dock-groups-presentation.md`](./03-dock-groups-presentation.md) | Introduce a **"Nuxt" dock group** and a general **promote‑tab‑to‑dock** capability; relocate a curated set of tools onto the dock bar. | High (UX) | landed foundation |

Recommended order: **01 → 02 → 03**. Each is technically buildable/reviewable as
a **separate PR** on top of the landed foundation (#1021/#1023).

> **Ecosystem dogfooding** (the former "plan 04") is being handled separately in
> nuxt/devtools#1022 (`playgrounds-ecosystem/`), so it no longer lives here. Use
> those playgrounds to verify plans 01–03 against real module integrations and to
> capture per-module compatibility reports.

## Shared facts every plan relies on

**Versions** (already in `pnpm-workspace.yaml` catalogs): `@vitejs/devtools`
`^0.4.0`, `@vitejs/devtools-kit` `^0.4.0`, `vite-plugin-inspect` `^12.0.2`,
`vue` `^3.5.39`; transitively `devframe`/`@devframes/hub`/`@devframes/plugin-*`
`0.6.0`; `nostics` `1.1.4`.

**devframe host APIs (node side)** — from `@devframes/hub` (re-exported by
`@vitejs/devtools-kit`), reached via `ctx` from `onDevtoolsReady`:

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

Foundation (landed in #1021/#1023 — for reference, not to rebuild):
- **Devframe-native API exposed** via the server + client `onDevtoolsReady`
  hooks and `nuxt.devtools.devtoolsKit` / `client.devtools.devtoolsKit`. The
  connect-safe-accessor idea was dropped in favour of the ready hooks (kit
  guaranteed present, no queue).
- **Self-discoverable deprecations** via the Nuxt **nostics** catalog
  (`deprecate()` → console pre-connect + DevTools diagnostics host post-connect;
  every code carries `why` + `fix` + a migration-guide doc link).
- **Shim-first**: existing APIs keep working this major via shims; deprecations
  are warnings; removal deferred to the next major.

Messages (plan 01):
- **Unify everything into the devframe Messages system** (one notification
  system). The client toast is re-implemented to push into it.
- **Tiered by intent**: ephemeral client feedback → `notify + autoDismiss +
  autoDelete` (toast-only, no history); server-originated → persisted + leveled.
- **Public notify API** (a `devtools:notify` Nuxt hook and/or
  `useNuxtDevTools().notify()`) forwarded to `ctx.messages`, plus a curated set
  of built-in sources (build/module errors & warnings, server-task results).

Terminals (plan 02):
- **Full replacement + compat shim**: retire the `@xterm` UI + `server-rpc/terminals`
  + terminals tab; route sessions through `ctx.terminals` (built-in Terminals
  dock); keep the `devtools:terminal:register` hook as a shim forwarding to
  `ctx.terminals`.
- Capability: **preserve output-only** for existing module terminals (map to
  read-only registered sessions), **add opt-in PTY** for new interactive use.
- Note: the `startSubprocess` (`NDT_DEP_0004`) and `getProcess()` (`NDT_DEP_0001`)
  deprecation warnings already ship, but the shim still routes through the old
  `devtools:terminal:*` hooks — this plan swaps the underlying implementation.

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
- Tension to keep in mind: `addCustomTab` is now soft-deprecated (`NDT_DEP_0005`)
  toward `ctx.docks.register`. Plan 03 still adds a `dock:true` convenience flag
  on the custom-tab API, but docks is the long-term path (docks doesn't yet cover
  `vnode` views or tab categories, which is why custom tabs still exist).

## Working agreement

- Base each PR on a fresh branch off `origin/main`.
- Follow the repo's `AGENTS.md`; run `pnpm lint`, `pnpm build`, `pnpm typecheck`,
  and the relevant `pnpm test:e2e` before opening a PR.
- Conventional Commits; one PR per plan; note in the PR body that it was created
  with the help of an agent.
