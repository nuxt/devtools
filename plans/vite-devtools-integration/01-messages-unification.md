# Plan 01 — Unify notifications on the devframe Messages system

**Status:** ready to execute · **Risk:** low · **Depends on:** the landed
compat/deprecation foundation (nuxt/devtools#1021, #1023 — see the folder README)
**Outcome:** one notification system across Nuxt DevTools — ephemeral toasts and
persistent, leveled notifications both flow through devframe's Messages
subsystem, surfaced by Vite DevTools' built-in **Messages** dock and its toast
overlay. Nuxt's bespoke `devtoolsUiShowNotification` toast is retired (or reduced
to a thin adapter).

> Self-contained: read this whole file; you don't need other plans. Shared API
> facts are repeated here.

## Relationship to the landed foundation

The compat/deprecation foundation has **already shipped** (nuxt/devtools#1021
server-side, #1023 client-side). Build on it — do not rebuild it:

- **Reach `ctx.messages` via the ready hooks**, which hand you the *already
  connected* context — there is no pre-connect window to guard and **no queue to
  manage**:
  - Server: `onDevtoolsReady((ctx) => ctx.messages.…)` from `@nuxt/devtools-kit`
    (raw escape hatch: `nuxt.devtools.devtoolsKit?.messages`).
  - Client: `onDevtoolsReady((kit) => …)` from `@nuxt/devtools-kit/iframe-client`,
    or `client.devtools.devtoolsKit` — the connected `DevToolsRpcClient`, so you
    can call the messages RPC without importing `@vitejs/devtools-kit/client`.
- **Emit the toast soft-deprecation through the nostics catalog**
  (`deprecate(nuxt, code, params)` from `packages/devtools-kit/src/diagnostics.ts`)
  with the **next free** `NDT_DEP_xxxx` code (don't reuse `0002`) rather than an
  ad-hoc `console.warn`; add the code to `diagnosticCodes` and give it a
  migration-guide anchor.

## Context you need

Repo: `nuxt/devtools` monorepo (this checkout). Nuxt DevTools v4 renders inside
**Vite DevTools** `@vitejs/devtools@0.4` on the **devframe 0.6** runtime. The
built-in **Messages** dock (`@devframes/plugin-messages`) is already mounted by
`DevTools()` (Nuxt uses default options) and auto-hides when there are no
persisted entries. PR nuxt/devtools#1010 (already on `main`) kept the Vite
DevTools core toast working: a message with `notify: true` shows a floating
toast in the Vite DevTools chrome (rendered above the panel iframe).

### Current Nuxt notification system (to be replaced)

- `packages/devtools-ui-kit/src/composables/notification.ts` — defines
  `devtoolsUiShowNotification({ message, icon?, classes?, duration?, position? })`
  which proxies to a fn registered by `devtoolsUiProvideNotificationFn`.
- `packages/devtools-ui-kit/src/components/NNotification.vue` — the single
  transient toast component (one message at a time, default 1500ms, default
  `top-center`); registers the provider fn; mounted once in
  `packages/devtools/client/app.vue` (`<NNotification />`, ~line 146).
- Callers of `devtoolsUiShowNotification` (all client-side, fire-and-forget):
  - `packages/devtools/client/components/AssetDetails.vue` (multiple)
  - `packages/devtools/client/components/AssetDropZone.vue` (multiple)
  - `packages/devtools/client/composables/editor.ts`
  - `packages/devtools/client/pages/modules/timeline.vue`

There is **no** message history / severity / server-originated notification
today.

### devframe Messages API (target)

**Node side** — `ctx.messages` (a `DevframeMessagesHost`) where `ctx` is the
connected `ViteDevToolsNodeContext` handed to you by
`onDevtoolsReady((ctx) => …)` (from `@nuxt/devtools-kit`). It is also stored as
`devtoolsKit` on the Nuxt server context (see
`packages/devtools/src/server-rpc/index.ts` → `connectDevToolsKit`, which fires
the `devtools:ready` hook, and the `devtoolsKit` field typed in
`packages/devtools-kit/src/_types/server-ctx.ts`):

```ts
ctx.messages.add({ message, level, description?, notify?, autoDismiss?, autoDelete?, labels?, category?, filePosition?, stacktrace? })
ctx.messages.info|warn|error|success|debug(message, extra?)  // Promise<DevframeMessageHandle>
ctx.messages.update(id, patch); ctx.messages.remove(id); ctx.messages.clear()
```

Key entry fields:
- `level`: `'info' | 'warn' | 'error' | 'success' | 'debug'`.
- `notify`: show a transient toast in the Vite DevTools chrome.
- `autoDismiss`: toast auto-hides.
- `autoDelete`: entry is not kept in the persistent list (toast-only).

**Client side** — since nuxt/devtools#1023 the client exposes the connected
devframe client directly: `client.devtools.devtoolsKit` is the connected
`DevToolsRpcClient`, and `onDevtoolsReady((kit) => …)` from
`@nuxt/devtools-kit/iframe-client` hands you that same `kit`. Use it to add
messages from the client (`kit.client.call('<messages-method>', …)`) rather than
hand-rolling `getDevToolsRpcClient()`.

Confirm the exact messages RPC method at build time by inspecting
`node_modules/.pnpm/@devframes+plugin-messages@0.6.0*/…/dist/rpc`
(`devframes-plugin-messages:list|add|update|remove|clear`). There is also a core
kit surface (`devtoolskit:internal:messages:*` / `hub:messages:*`) visible in
the connection meta; prefer the plugin method, and fall back to whichever one
actually drives the core toast if the plugin one does not (verify with a manual
`kit.client.call(...)` in the running playground). The legacy
`packages/devtools/client/composables/rpc.ts` proxy still exists but
`extendClientRpc` is now deprecated in favour of `onDevtoolsReady`.

## Decisions (locked)

1. **Unify** everything onto the devframe Messages system — no parallel toast.
2. **Tiered by intent**:
   - Ephemeral client feedback (e.g. "Copied!") → `notify: true`,
     `autoDismiss: true`, `autoDelete: true` (toast-only, never persisted).
   - Server-originated notifications → persisted, with a real `level`, no
     `autoDelete`, so they build history in the Messages dock.
3. **Public notify API** for Nuxt internals + ecosystem modules, forwarded to
   `ctx.messages`, plus a curated set of built-in sources.

## Implementation

### Step 1 — server: a notify path into `ctx.messages`

- In the server RPC layer (`packages/devtools/src/server-rpc/`), add a small
  module (e.g. `messages.ts`) wired in `server-rpc/index.ts` alongside the other
  `setup*RPC` calls. It should:
  - Expose a helper `notify(input)` that adds to `ctx.messages`. Get the
    connected context from `onDevtoolsReady((ctx) => …)` (capture `ctx.messages`
    once ready); no manual queue/flush is needed because the ready hook only
    fires post-connect. Buffer any `notify(...)` calls made before `ready` and
    replay them in the `onDevtoolsReady` callback if early emission matters.
  - Register a Nuxt hook **`devtools:notify`** (add it to the hooks type in
    `packages/devtools-kit/src/_types/hooks.ts`) so modules can push:
    `nuxt.callHook('devtools:notify', { message, level?, description?, … })`.
  - Expose an RPC function `notify(input)` on the server functions so the client
    can push server-persisted messages when appropriate.
- Type the notify input as a Nuxt-friendly subset of `DevframeMessageEntryInput`
  (`message`, `level?`, `description?`, `labels?`, `filePosition?`, `notify?`,
  `autoDismiss?`, `autoDelete?`).

### Step 2 — curated built-in sources

Wire an initial, deliberately small set of internal producers to `notify(...)`
(persisted, leveled — no `autoDelete`):

- **Build / module errors & warnings**: hook Vite/Nuxt build errors and module
  setup warnings. Start with the ones Nuxt DevTools already knows about
  (e.g. analyze-build failures in `packages/devtools/src/integrations/analyze-build.ts`,
  and module-install failures surfaced via the terminal/exit path).
- **Server task results**: on server-task completion/failure (see
  `packages/devtools/src/server-rpc/server-tasks.ts`) push a `success`/`error`.

Keep this curated — do **not** blanket-mirror consola. Each source should be an
intentional, leveled message.

### Step 3 — client: re-point the ephemeral toast

- Reimplement `devtoolsUiShowNotification` (in
  `packages/devtools-ui-kit/src/composables/notification.ts`) so that, instead of
  driving the local `NNotification` component, it emits a devframe message with
  `notify:true, autoDismiss:true, autoDelete:true` and a `level` derived from
  intent (default `info`; allow callers to pass one). Emit the toast
  soft-deprecation for `devtoolsUiShowNotification` via `deprecate(...)` (next
  free `NDT_DEP_xxxx`) if you keep it as a thin adapter.
  - The UI kit must not hard-depend on the devtools client RPC. Keep the
    `devtoolsUiProvideNotificationFn` seam: the **client** provides the concrete
    implementation at startup; the UI kit stays a thin proxy. Register the
    devframe-backed implementation from the Nuxt DevTools client via
    `devtoolsUiProvideNotificationFn`, using the client-side
    `onDevtoolsReady((kit) => …)` (from `@nuxt/devtools-kit/iframe-client`) /
    `client.devtools.devtoolsKit` from #1023 to obtain the connected client and
    call the messages RPC (e.g. in `packages/devtools/client/plugins/` or
    `app.vue` setup).
- Map the existing callers' options (`message`, `icon`, `duration`, `position`)
  onto message fields where they have an equivalent; `position`/`duration` become
  no-ops or best-effort (the chrome toast owns placement/timing). Audit each
  caller (`AssetDetails.vue`, `AssetDropZone.vue`, `editor.ts`, `timeline.vue`)
  and keep the call sites unchanged in shape if possible.

### Step 4 — retire the bespoke toast

- Remove `<NNotification />` from `packages/devtools/client/app.vue` and delete
  (or empty) `packages/devtools-ui-kit/src/components/NNotification.vue` once no
  caller renders it. If the UI kit exports `NNotification` publicly, keep an
  export shim or do a deprecation cycle (see risks).

### Step 5 — expose `notify` in the public client API

- Add `notify(...)` to the injected client (`NuxtDevtoolsClient` /
  `useNuxtDevTools()` — see `packages/devtools/src/runtime/use-nuxt-devtools.ts`
  and the client injection in `packages/devtools/client/composables/client.ts`),
  so custom tabs and host code can push notifications through the same system.

## Acceptance criteria

- Triggering a "Copied!"-style action shows a transient toast in the Vite
  DevTools chrome and leaves **no** entry in the Messages dock list.
- `nuxt.callHook('devtools:notify', { message, level: 'error' })` (and a build
  error from a curated source) shows a toast **and** a persisted entry with the
  correct severity in the Messages dock.
- The old `NNotification` component is no longer mounted; no dead
  `devtoolsUiShowNotification` behavior remains.
- `pnpm lint && pnpm build && pnpm typecheck` pass.
- Manual: run `pnpm -C playgrounds/tab-pinia exec nuxt dev`; open Vite DevTools;
  confirm toast placement and Messages-dock persistence for both tiers.

## Risks / gotchas

- **Which RPC method drives the core toast.** Verify empirically in the running
  playground (`kit.client.call('devframes-plugin-messages:add', …)` vs the
  `devtoolskit:internal:messages:*` / `hub:messages:*` methods, with `kit` from
  the client `onDevtoolsReady`). Whichever makes a floating toast appear is the
  one to use for the ephemeral tier.
- **Toast location.** The chrome toast renders in the Vite DevTools host layer,
  not inside the (possibly promoted, separate) Nuxt iframe where the action
  happened. This is expected under "unify"; confirm it renders above the panel.
- **UI-kit dependency direction.** Don't make `@nuxt/devtools-ui-kit` depend on
  the devtools client RPC. Preserve the `devtoolsUiProvideNotificationFn` seam.
- **Public API break.** If `NNotification` / `devtoolsUiShowNotification` are
  part of the UI kit's public surface, keep a compatibility shim and deprecate
  rather than hard-remove.
