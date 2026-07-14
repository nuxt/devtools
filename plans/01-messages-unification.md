# Plan 01 — Unify notifications on the devframe Messages system

**Status:** ready to execute · **Risk:** low · **Depends on:** nothing
**Outcome:** one notification system across Nuxt DevTools — ephemeral toasts and
persistent, leveled notifications both flow through devframe's Messages
subsystem, surfaced by Vite DevTools' built-in **Messages** dock and its toast
overlay. Nuxt's bespoke `devtoolsUiShowNotification` toast is retired (or reduced
to a thin adapter).

> Self-contained: read this whole file; you don't need other plans. Shared API
> facts are repeated here.

## Relationship to Plan 00 (foundation)

If Plan 00 (compat foundation) has landed, prefer its **connect-safe**
`nuxt.devtools.messages` host over reaching into `nuxt.devtools.devtoolsKit.messages`
directly (it queues pre-connect calls for you), and emit the toast
soft-deprecation through Plan 00's **nostics** catalog (a `NDT_DEP_xxxx` code
with `fix` + doc link) rather than an ad-hoc `console.warn`. If Plan 00 is not
yet in place, use `devtoolsKit.messages` guarded for the undefined-until-connect
window (queue + flush like `server-rpc/index.ts`'s `pendingBroadcasts`).

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
`ViteDevToolsNodeContext` available in `module-main.ts`'s
`devtools.setup(ctx)` and stored as `devtoolsKit` on the Nuxt server context
(see `packages/devtools/src/server-rpc/index.ts` → `connectDevToolsKit`, and the
`devtoolsKit` field typed in `packages/devtools-kit/src/_types/server-ctx.ts`):

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

**Client side** — the Nuxt DevTools client already holds a devframe RPC client
(`packages/devtools/client/composables/rpc.ts` → `rpcClient` /
`getDevToolsRpcClient()`, and the `rpc` proxy that does `client.call(method, …)`).
Messages can be added from the client by calling the messages RPC method
(`devframes-plugin-messages:add`) — the client is trusted and the method is
registered by the plugin. Confirm the exact method name at build time by
inspecting `node_modules/.pnpm/@devframes+plugin-messages@0.6.0*/…/dist/rpc`
(`devframes-plugin-messages:list|add|update|remove|clear`). There is also a core
kit surface (`devtoolskit:internal:messages:*` / `hub:messages:*`) visible in
the connection meta; prefer the plugin method, and fall back to whichever one
actually drives the core toast if the plugin one does not (verify with a manual
`rpc.call(...)` in the running playground).

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
  - Expose a helper `notify(input)` that calls `ctx.devtoolsKit?.messages.add(…)`
    (guard for `devtoolsKit` being `undefined` before the kit connects — queue
    and flush on connect, mirroring how `server-rpc/index.ts` already queues
    `pendingBroadcasts` until `connectDevToolsKit` runs).
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
  driving the local `NNotification` component, it emits a devframe message via
  the client RPC with `notify:true, autoDismiss:true, autoDelete:true` and a
  `level` derived from intent (default `info`; allow callers to pass one).
  - The UI kit must not hard-depend on the devtools client RPC. Keep the
    `devtoolsUiProvideNotificationFn` seam: the **client** provides the concrete
    implementation (which calls the devframe RPC) at startup; the UI kit stays a
    thin proxy. So: keep `notification.ts` as the proxy, and register the
    devframe-backed implementation from the Nuxt DevTools client (e.g. in
    `packages/devtools/client/plugins/` or `app.vue` setup) via
    `devtoolsUiProvideNotificationFn`.
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
  playground (`rpc.call('devframes-plugin-messages:add', …)` vs the
  `devtoolskit:internal:messages:*` / `hub:messages:*` methods). Whichever makes
  a floating toast appear is the one to use for the ephemeral tier.
- **Toast location.** The chrome toast renders in the Vite DevTools host layer,
  not inside the (possibly promoted, separate) Nuxt iframe where the action
  happened. This is expected under "unify"; confirm it renders above the panel.
- **UI-kit dependency direction.** Don't make `@nuxt/devtools-ui-kit` depend on
  the devtools client RPC. Preserve the `devtoolsUiProvideNotificationFn` seam.
- **Public API break.** If `NNotification` / `devtoolsUiShowNotification` are
  part of the UI kit's public surface, keep a compatibility shim and deprecate
  rather than hard-remove.
