# Plan 02 — Reuse the built-in devframe Terminals dock

**Status:** ready to execute · **Risk:** medium · **Depends on:** nothing
**Outcome:** Nuxt DevTools stops shipping its own `@xterm` terminal UI + RPC and
instead surfaces terminal sessions through devframe's `ctx.terminals`, so they
render in Vite DevTools' built-in **Terminals** dock. Existing modules that use
the `devtools:terminal:register` hook keep working via a compat shim. A new
opt-in interactive **PTY** path is added.

> Self-contained: read this whole file; shared API facts are repeated here.

## Relationship to Plan 00 (foundation)

If Plan 00 (compat foundation) has landed, prefer its **connect-safe**
`nuxt.devtools.terminals` host over `nuxt.devtools.devtoolsKit.terminals`
(it queues pre-connect `register`/`start…` calls), and emit the
`devtools:terminal:register` / `startSubprocess` soft-deprecations through Plan
00's **nostics** catalog (`NDT_DEP_xxxx` with `fix` + doc link). The
`getProcess()`→`getResult()` deprecation is already a Plan 00 pilot. If Plan 00
is not yet in place, use `devtoolsKit.terminals` guarded for the
undefined-until-connect window (queue + flush like `pendingBroadcasts`).

## Context you need

Nuxt DevTools v4 renders inside **Vite DevTools** `@vitejs/devtools@0.4` on the
**devframe 0.6** runtime. `DevTools()` (Nuxt uses default options) already mounts
the built-in **Terminals** dock (`@devframes/plugin-terminals`), which auto-hides
when there are no sessions and **surfaces sessions registered on the hub
terminals host read-only** (in addition to ones it spawns itself).

### Current Nuxt terminals system (to be replaced)

Model today = "a module spawns/owns its own process and streams output to
DevTools; DevTools is a passive viewer" (output-only; no stdin, no resize).

- **Server RPC:** `packages/devtools/src/server-rpc/terminals.ts` —
  `setupTerminalRPC({ nuxt, rpc, refresh })` keeps an in-memory
  `Map<string, TerminalState>` and listens on Nuxt hooks:
  - `devtools:terminal:register` → add + `refresh('getTerminals')`
  - `devtools:terminal:remove` → delete
  - `devtools:terminal:write` → append to `terminal.buffer` +
    `rpc.broadcast.onTerminalData.asEvent({ id, data })`
  - `devtools:terminal:exit` → mark `isTerminated` +
    `rpc.broadcast.onTerminalExit.asEvent({ id, code })`
  - RPC fns: `getTerminals()`, `getTerminalDetail(id)` (with buffer),
    `runTerminalAction(id, 'restart'|'terminate'|'remove'|'clear')`.
  - Wired in `packages/devtools/src/server-rpc/index.ts` via `setupTerminalRPC(ctx)`.
- **Process lifecycle helper:** `packages/devtools-kit/src/index.ts` (~lines
  46‑121) — `start`/`restart`/`clear`/`terminate`/`register` spawn via
  `tinyexec`'s `x()`, force `COLORS`/`FORCE_COLOR`, pipe stdout/stderr through
  `devtools:terminal:write`, and fire `devtools:terminal:exit` on exit.
- **Client:**
  - `packages/devtools/client/pages/modules/terminals.vue` (the "Terminals" tab,
    inside `<AuthRequiredPanel>`).
  - `packages/devtools/client/components/TerminalPage.vue` (tab bar / selection /
    remove).
  - `packages/devtools/client/components/TerminalView.vue` — `new Terminal()`
    from `@xterm/xterm` + `FitAddon` from `@xterm/addon-fit` + `@xterm/xterm/css/xterm.css`;
    seeds from `getTerminalDetail`, streams via the `devtools:terminal:data`
    client hook; footer buttons call `runTerminalAction`.
  - Client broadcast handlers in `packages/devtools/client/setup/client-rpc.ts`
    (`onTerminalData` → `devtools:terminal:data` hook; `onTerminalExit` → cleanup
    of installing-modules / analyze-build subprocess entries).
- **Types:** broadcast signatures in `packages/devtools-kit/src/_types/rpc.ts`
  (`onTerminalData`, `onTerminalExit`); hook signatures in
  `packages/devtools-kit/src/_types/hooks.ts` (`devtools:terminal:register/write/…`).
- **Deps:** `@xterm/addon-fit`, `@xterm/xterm` in `packages/devtools/package.json`.
- **Internal consumers of the terminal pipeline** (must keep working): module
  installation and analyze-build spawn terminals and rely on
  `devtools:terminal:exit` to clean up their UI state (see
  `state-subprocess` usage in `client-rpc.ts`, and
  `packages/devtools/src/integrations/analyze-build.ts` /
  the npm/module-install RPC).

### devframe Terminals API (target)

`ctx.terminals` is a `DevframeTerminalsHost` on the `ViteDevToolsNodeContext`
available in `packages/devtools/src/module-main.ts`'s `devtools.setup(ctx)` and
stored as `devtoolsKit` on the Nuxt server context
(`packages/devtools/src/server-rpc/index.ts` → `connectDevToolsKit`;
`packages/devtools-kit/src/_types/server-ctx.ts` `devtoolsKit` field):

```ts
interface DevframeTerminalsHost {
  readonly sessions: Map<string, DevframeTerminalSession>
  readonly events: EventEmitter<{ 'terminal:session:updated': (s) => void }>
  register: (session: DevframeTerminalSession) => DevframeTerminalSession  // surface an externally-owned session (read-only)
  update:   (session: DevframeTerminalSession) => void
  startChildProcess: (exec, terminal) => Promise<DevframeChildProcessTerminalSession> // output-only, devframe owns process
  startPtySession:   (exec, terminal) => Promise<DevframePtyTerminalSession>          // interactive: write(data)+resize(cols,rows)
}
// DevframeTerminalSession: { id, title, status:'running'|'stopped'|'error', icon?, interactive?, buffer?: string[], stream?: ReadableStream<string> }
```

Two ways to feed it:
- **`register(session)`** — for the current model where *the module owns the
  process*. Provide a session carrying a `stream` (or `buffer`) you push into.
  This is the mapping for the compat shim.
- **`startChildProcess` / `startPtySession`** — for the *new* model where
  devframe spawns and owns the process from `{ command, args, cwd?, env? }`.

## Decisions (locked)

1. **Full replacement + compat shim**: delete Nuxt's terminal UI (`@xterm`),
   `server-rpc/terminals.ts`, and the Terminals tab; route sessions through
   `ctx.terminals` (built-in Terminals dock). **Keep the
   `devtools:terminal:register` hook** as a shim forwarding to `ctx.terminals`
   so existing modules keep working unchanged.
2. **Capability**: preserve **output-only** for existing module terminals (map to
   read-only registered sessions via `ctx.terminals.register` + a stream fed by
   `devtools:terminal:write`), and **add opt-in interactive PTY** via
   `ctx.terminals.startPtySession` for new use cases.

## Implementation

### Step 1 — bridge the Nuxt terminal hooks onto `ctx.terminals` (compat shim)

Rewrite `packages/devtools/src/server-rpc/terminals.ts` (or replace it with a
`terminals-bridge` integration) so that instead of maintaining its own map + RPC
it:

- On `devtools:terminal:register`: create a `ReadableStream<string>` (keep its
  controller in a `Map<id, controller>`), build a `DevframeTerminalSession`
  `{ id, title: terminal.name, status: 'running', icon?, stream }`, and call
  `devtoolsKit.terminals.register(session)`. Guard for `devtoolsKit` being
  `undefined` before the kit connects — queue registrations and flush them in
  `connectDevToolsKit` (mirror the existing `pendingBroadcasts` pattern in
  `server-rpc/index.ts`).
- On `devtools:terminal:write`: `controller.enqueue(data)` for that id (and keep
  a rolling buffer if the session's initial `buffer` needs seeding).
- On `devtools:terminal:exit`: `controller.close()`, set the session `status` to
  `'stopped'`/`'error'` and `devtoolsKit.terminals.update(session)`.
- On `devtools:terminal:remove` + `runTerminalAction` semantics: map
  `restart`/`terminate`/`remove`/`clear` onto the module-provided
  `onActionRestart`/`onActionTerminate` callbacks (still owned by the module) and
  the session lifecycle. The built-in Terminals dock provides the UI controls; if
  a control has no counterpart on a read-only registered session, hide/disable it
  (registered read-only sessions have no `write`/`resize`).

Keep the `TerminalState`/`TerminalInfo`/`TerminalAction` types and the
`devtools:terminal:*` hook signatures (`packages/devtools-kit/src/_types/`) so
module-facing contracts don't change.

### Step 2 — internal producers keep working

- The module-install and analyze-build flows currently spawn via the
  devtools-kit `start()` helper and rely on `devtools:terminal:exit`. Keep
  `packages/devtools-kit/src/index.ts`'s `start()`/`register()` API (it fires the
  same hooks), so those producers are unchanged; they now surface via the bridge
  in the built-in dock.
- The client-side cleanup in `client-rpc.ts` (`onTerminalExit` → prune
  installing-modules / analyze-build state) depends on the exit broadcast. Since
  we're removing the Nuxt terminals RPC, **re-home that cleanup**: subscribe to
  terminal exit via the devframe terminals host events (or keep a minimal
  server→client broadcast for exit) so subprocess UI state still clears.
  Do **not** lose this behavior.

### Step 3 — add an opt-in PTY path

- Add a server helper (e.g. on the Nuxt server context / a new
  `devtools:terminal:spawn` hook option `{ interactive: true }`) that calls
  `devtoolsKit.terminals.startPtySession({ command, args, cwd, env, cols, rows }, { id, title })`.
  Interactive sessions get stdin `write` + `resize` handled entirely by the
  built-in Terminals dock UI (no Nuxt client code needed).
- Note PTY uses `zigpty` native bindings with graceful pipe fallback
  (`isPtyAvailable()`); the fallback degrades TUI fidelity but still runs — no
  hard failure if bindings are missing. Do **not** make PTY the default.

### Step 4 — delete the bespoke UI + deps

- Remove `packages/devtools/client/pages/modules/terminals.vue`,
  `components/TerminalPage.vue`, `components/TerminalView.vue`.
- Remove the `@xterm/xterm` + `@xterm/addon-fit` deps from
  `packages/devtools/package.json` (and the catalog entries in
  `pnpm-workspace.yaml` if now unused), plus the optimizeDeps/prebundle mentions
  of xterm if any. Run an install to refresh the lockfile.
- Remove the now-unused `onTerminalData`/`getTerminals`/`getTerminalDetail`
  client and server surface (keep only what Step 2's cleanup needs).
- Drop the "Terminals" entry from the client tab list (the SideNav will no longer
  show it; the built-in Terminals dock replaces it).

## Acceptance criteria

- A module registering a terminal via `nuxt.callHook('devtools:terminal:register', …)`
  and streaming output via `devtools:terminal:write` shows up as a read-only
  session in the built-in **Terminals** dock, with live output; the Nuxt
  "Terminals" tab no longer exists.
- Module install / analyze-build still work end-to-end, and their transient UI
  state clears on process exit.
- An opt-in interactive PTY session accepts keystrokes and resizes in the
  built-in dock (or degrades to piped output if zigpty is unavailable).
- No `@xterm/*` deps remain; `pnpm lint && pnpm build && pnpm typecheck` pass.
- Manual: a playground module that registers a dev-server terminal shows it in
  the Terminals dock.

## Risks / gotchas

- **Ownership-model mismatch.** The current hook model is "module owns the
  process"; `startChildProcess`/`startPtySession` are "devframe owns it". Use
  `register(session)` + a stream for the shim so module-owned processes keep
  their lifecycle/`onActionRestart`/`onActionTerminate` semantics.
- **Don't drop exit-driven cleanup.** `client-rpc.ts` prunes installing-modules /
  analyze-build state on `devtools:terminal:exit`. Preserve an exit signal path.
- **Timing before kit connect.** Terminals may register before
  `connectDevToolsKit` runs; queue + flush (mirror `pendingBroadcasts`).
- **Read-only session controls.** Registered read-only sessions have no
  `write`/`resize`; make sure the dock UI doesn't imply interactivity for them
  (rely on the session's `interactive` flag being falsy).
- **PTY native bindings** may be absent in some environments — keep PTY opt-in
  and rely on the documented pipe fallback.
