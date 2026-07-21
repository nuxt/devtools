# Plan 02 - Finish Messages and terminals convergence

**Status:** ready to execute; **Risk:** high; **Depends on:** the v4 ready-hook
and diagnostics foundation already on main
**Outcome:** client notifications work through the Devframe 0.7 Messages host,
all terminal output appears in Vite DevTools' built-in Terminals dock, and Nuxt
no longer ships its own xterm UI or terminal RPC.

## Why this plan exists

Messages is mostly migrated, but
`packages/devtools/client/composables/notify.ts` calls the removed Devframe 0.6
method `devframes-plugin-messages:add`. Devframe 0.7's stable hub boundary is
`hub:messages:add`, so client toasts currently fail best-effort and log an error.

Terminals is in a split state:

- analyze-build and package operations already call
  `ctx.terminals.startChildProcess()`;
- legacy module hooks still feed `server-rpc/terminals.ts` and Nuxt's xterm page;
- several buttons route platform session IDs to that unrelated old page;
- client cleanup still waits for legacy `onTerminalExit` broadcasts that direct
  Devframe sessions never emit;
- fixed process IDs collide with retained Devframe sessions on repeated runs.

Devframe 0.7 cannot unregister externally owned sessions or attach their legacy
restart/terminate callbacks. The agreed compatibility boundary is therefore
output and final status only through v4.

## Drift check

Verify before editing:

1. `notify.ts` still uses `devframes-plugin-messages:add`.
2. Devframe 0.7 still registers `hub:messages:add`.
3. `ctx.terminals` still provides `register`, `update`, and
   `startChildProcess`, but no public `remove`/`unregister`.
4. `server-rpc/terminals.ts`, the Nuxt terminals page, `TerminalPage.vue`, and
   `TerminalView.vue` still exist.
5. analyze-build and npm RPCs already use `startChildProcess`.
6. the terminal navigation sites still exist in
   `client/pages/modules/analyze-build.vue`, `client/pages/modules/modules.vue`,
   `client/components/ModuleItem.vue`, and
   `client/components/NpmVersionCheck.vue`;
7. every consumer of `onTerminalExit` has been inventoried, including
   `client/composables/npm.ts` package-update state and
   `client/components/RestartDialogs.vue`.

**STOP:** if Devframe has added supported external-session action and removal
APIs, revisit the output-only bridge before implementing it. Do not depend on a
concrete host's private `remove` method.

## Scope

This plan includes the small Messages transport repair and the complete terminal
cleanup because both finish partially landed platform-service migrations.

It does not add new server notification producers, add a Nuxt PTY wrapper, group
the built-in Messages/Terminals docks under Nuxt, or preserve Nuxt's terminal UI
controls.

## Implementation

### 1. Repair the Messages client transport

Change the client add method to `hub:messages:add`. Keep the existing payload
mapping and numeric `autoDismiss` / `autoDelete` values. Do not add fallback RPC
names: this plan targets Devframe 0.7.

Add focused coverage that asserts:

- the client calls `hub:messages:add`;
- `notify` defaults to `true` and `level` to `info`;
- the UI-kit adapter sends numeric lifetimes;
- failures remain best-effort and do not reject callers.

Update comments and plan/docs references that still call booleans valid lifetime
values or mention the Devframe 0.6 namespace. Do not add the previously proposed
server-task notifications.

### 2. Create unique IDs for Nuxt-owned process runs

Add one small server-side helper that derives a unique session ID from a readable
base ID plus a monotonic or collision-safe suffix. Use it in:

- `server-rpc/analyze-build.ts`;
- `server-rpc/npm.ts` for generic package commands;
- module install and uninstall execution.

Return the actual unique ID to the client. For the two-phase module flow, thread
the ID returned by the dry-run/confirmation call into the execution call rather
than generating a different ID after the UI starts tracking it. Update the RPC
types and caller together.

Use the same handshake for generic package updates: extend the existing command
confirmation/preparation response to include a unique session ID, assign
`processId.value` before invoking `runNpmCommand`, and pass that ID into the run
RPC. Never generate the tracked ID only after the process has started.

Do not use random IDs without a readable prefix. Completed sessions intentionally
remain visible for the dev-server lifetime because public Devframe 0.7 APIs cannot
remove them.

### 3. Replace legacy terminal RPC with an output bridge

Rewrite `server-rpc/terminals.ts` as a bridge from the existing
`devtools:terminal:*` Nuxt hooks to `ctx.terminals`:

- Buffer registrations, chunks, **and exit status** that arrive before
  `devtools:ready`. A short-lived legacy process can exit before the kit
  connects; dropping that exit would leave the eventual session stuck as
  `running` forever.
- On each legacy registration, mint a unique Devframe session ID and a
  **generation token** for that run, plus a `ReadableStream<string>` and a
  pre-connect chunk buffer.
- Register `{ id, title, icon, status: 'running', stream }` once the host is
  ready, then enqueue every buffered pre-ready chunk through that stream in
  order. Devframe Terminals 0.7.5 does not replay `session.buffer` for foreign
  sessions. If an exit was buffered for this legacy ID before registration,
  apply it immediately after registering — close the stream and set the final
  `stopped`/`error` status — instead of leaving the session `running`.
- Route later `devtools:terminal:write` calls to the same stream for the legacy
  ID, gated by the generation check below.
- On `devtools:terminal:exit`, close the stream and update status to `stopped`
  for exit code 0 or an omitted code, and `error` only for a defined non-zero
  code.
- On re-register/clear/restart of the same legacy ID, mint a **new** generation
  token, close the prior run's stream, and create a new unique session. Every
  `write`/`exit`/`remove` handler must check the event's generation against the
  currently mapped one for that legacy ID and drop the event if it is stale (a
  delayed callback from the process a restart just replaced). Do not call
  `register` twice with one Devframe ID.
- On `devtools:terminal:remove`, close and stop the current bridge session
  (matching generation), then forget the legacy-ID mapping. The retained
  Devframe history entry is expected.

Ignore `onActionRestart`, `onActionTerminate`, `restartable`, and `terminatable`
when projecting the session. Programmatic methods on `startSubprocess()` still
work because that helper owns its process and emits new hook events; only the old
Nuxt UI controls disappear.

Keep the existing `NDT_DEP_0001` and `NDT_DEP_0004` warnings. Do not add another
warning inside `devtools:terminal:register`: `startSubprocess()` emits that hook
internally and would otherwise double-warn every compatibility caller. Document
direct hook usage as legacy in `docs/content/2.module/3.migration-v4.md`, state
that the bridge is output-only, and announce its v5 removal.

### 4. Decouple terminal transport from process-state cleanup

Remove the broad dependency on `onTerminalExit`, retaining it only for the
generic package-update flow that must return before its process completes:

- For module install/uninstall, remove the matching client pending entry in a
  `finally` block around the execution RPC. The server RPC already awaits
  `session.getResult()`.
- Extend `getAnalyzeBuildInfo()`'s return with the active terminal session ID
  (e.g. `activeSessionId`) alongside `isBuilding`. `startAnalyzeBuild()` already
  calls `refresh('getAnalyzeBuildInfo')` right after `startChildProcess()`
  registers the session, before awaiting `session.getResult()` — keep that call
  site and just widen the payload, so the client's refetched info carries the
  session ID as soon as the build starts. Clear `activeSessionId` in the
  `refresh('getAnalyzeBuildInfo')` already made on completion/failure. Derive
  the client building state and "view terminal" action entirely from this
  refreshed info instead of `processAnalyzeBuildInfo` and an exit event.
- Keep a minimal `onTerminalExit` client event for generic package updates in
  `client/composables/npm.ts`, which must expose the session ID before the
  process starts through Step 2's confirmation handshake. Start a detached
  completion task that awaits `session.getResult()` and emits the event while
  the run RPC returns immediately. This event carries only `{ id, code }`; it is
  not a terminal data transport. Fix the existing comparison to use
  `processId.value`, not the Vue ref object.
- Preserve `RestartDialogs.vue` as the second consumer of that generic package
  completion event so its success/restart prompt keeps working.
- Keep server notifications and refreshes on process completion as they work
  today.

Remove `onTerminalData` from the client RPC implementation and types. Reduce
`onTerminalExit` to generic package-update consumers only and delete the
module-install and analyze-build branches after their replacements land. Remove
obsolete subprocess state only when no remaining caller uses it.

### 5. Activate the built-in Terminals dock

Add one client helper that calls the Devframe 0.7 dock activation RPC:

```ts
client.call('hub:docks:activate', {
  dockId: DEVTOOLS_TERMINALS_DOCK_ID,
  params: { sessionId },
})
```

Use `DEVTOOLS_TERMINALS_DOCK_ID` from `@vitejs/devtools-kit/constants`; do not
copy the built-in ID. Replace every route/link to `/modules/terminals` with this
helper in `analyze-build.vue`, `modules.vue`, `ModuleItem.vue`, and
`NpmVersionCheck.vue`.

### 6. Remove the duplicate terminal implementation

Delete:

- `client/pages/modules/terminals.vue`;
- `client/components/TerminalPage.vue`;
- `client/components/TerminalView.vue`;
- Nuxt terminal state composables used only by those files;
- `getTerminals`, `getTerminalDetail`, and `runTerminalAction` RPC contracts;
- the terminal-data broadcast and all exit-handler branches except the minimal
  generic package-update completion event from Step 4.

Remove `@xterm/xterm` and `@xterm/addon-fit` from package dependencies, catalogs
when unused, client CSS, and optimize-dependency configuration. Refresh the
lockfile with pnpm.

Keep the server hook types, `TerminalState`, and `startSubprocess` for the v4
output compatibility window. Mark action-related `TerminalState` fields as
deprecated if they are public and no longer represented in UI; do not delete
them until v5.

## Acceptance criteria

- A client `notify()` call creates a Devframe message/toast without an unknown
  RPC error.
- Existing `devtoolsUiShowNotification` calls show transient toasts with no
  persistent history after `autoDelete`.
- Repeating analyze-build, install, uninstall, and package update operations in
  one dev-server process never throws a duplicate terminal ID error.
- A legacy process that exits before `devtools:ready` still ends up `stopped`/
  `error` (not stuck `running`) once its session registers. A stale `write`/
  `exit`/`remove` from a restarted legacy ID's prior run never mutates the
  replacement session.
- Every "view terminal" action activates the built-in dock and selects the
  correct unique session.
- A module using legacy terminal register/write/exit hooks gets live output and
  final status in the built-in dock.
- Legacy restart/terminate/clear methods still control a `startSubprocess` owned
  process, but no Devframe UI action claims to expose those controls.
- Pending module/build UI clears on completion without `onTerminalExit`; generic
  package-update state still consumes the documented minimal completion event.
- Nuxt's Terminals SideNav entry, xterm components, xterm dependencies, and old
  terminal RPC functions are gone.

## Verification

Add unit tests for message transport, unique ID generation, bridge buffering
(including exit-before-ready and stale-generation dropping), re-registration,
status mapping, and client cleanup. Then run, using pnpm 11 (this repo's pinned
`packageManager`, not npm or yarn):

```sh
pnpm lint
pnpm build   # or `pnpm prepare` — either must run before `pnpm typecheck`
pnpm typecheck
pnpm test:unit
pnpm test:e2e:dev
```

Manually exercise one successful and one failing process, a repeated run, and a
legacy output stream. Confirm retained history is understandable and no control
is shown for a read-only external session.

## STOP conditions

- The built-in terminal dock cannot display or select a session registered on
  `ctx.terminals`. Reproduce against a minimal Devframe fixture before retaining
  Nuxt xterm as a fallback.
- `hub:docks:activate` or `DEVTOOLS_TERMINALS_DOCK_ID` has changed. Use the
  verified public replacement; do not navigate through private client state.
- A legacy action callback is required by a known in-repo consumer after the UI
  removal. Move that consumer to direct Devframe ownership instead of extending
  the compatibility bridge with private APIs.
