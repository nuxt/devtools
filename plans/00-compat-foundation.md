# Plan 00 — Compatibility & deprecation foundation

**Status:** ready to execute · **Risk:** medium · **Depends on:** nothing ·
**Foundation for:** plans 01, 02, 03 build on the surfaces this plan creates.
**Outcome:** Nuxt DevTools keeps its existing public API working, **exposes the
devframe-native API alongside it** (connect-safe), and gains a **nostics-driven
soft-deprecation** system so migrations are minimal and self-discoverable. This
is the base layer for the long-term move to devframe-native APIs.

> Self-contained: read this whole file. Shared API facts are repeated here.

## Why this exists

We're cutting a **new major** of Nuxt DevTools on top of Vite DevTools 0.4 /
devframe 0.6 (migration already merged, nuxt/devtools#1010). Breaking changes
are acceptable, but the migration for module authors/users must be **minimal**
and **self-discoverable**. Strategy:

1. **Keep** the existing Nuxt DevTools API working.
2. **Expose** the devframe-native API (docks/terminals/messages/commands/
   diagnostics) so authors can start using it directly.
3. **Soft-deprecate** the Nuxt API where a devframe equivalent exists, via a
   backward-compatible **shim** + a **nostics** deprecation diagnostic (code +
   fix + doc link). Hard-break only where a faithful shim is infeasible.
4. Long term: gradually retire the shimmed Nuxt APIs (next major).

Plans 01 (messages), 02 (terminals), 03 (dock groups) each *apply* this
foundation to their specific APIs. This plan builds the **mechanism** + policy +
a couple of pilot deprecations.

## Context you need

### The devframe-native context (target surface)

`nuxt.devtools.devtoolsKit` is a `ViteDevToolsNodeContext` (= devframe
`DevframeNodeContext`) exposing `docks`, `terminals`, `messages`, `commands`,
and **`diagnostics`** (a `DevframeDiagnosticsHost`). It is assigned in
`packages/devtools/src/server-rpc/index.ts` (`connectDevToolsKit(ctx)`), and is
**`undefined` until the Vite DevTools plugin connects** — typed
`devtoolsKit: DevToolsNodeContext | undefined` in
`packages/devtools-kit/src/_types/server-ctx.ts`. `server-rpc/index.ts` already
demonstrates the **pre-connect queue** pattern (`pendingBroadcasts`, flushed in
`connectDevToolsKit`).

### The current Nuxt DevTools public API surface (what modules use)

- **Server context** `nuxt.devtools` (`NuxtDevtoolsServerContext`,
  `packages/devtools-kit/src/_types/server-ctx.ts`): `rpc` (`rpc.broadcast`,
  `rpc.functions`), `extendServerRpc(name, fns)`, `refresh(event)`,
  `openInEditorHooks`, `devtoolsKit`.
- **`@nuxt/devtools-kit` root exports** (`packages/devtools-kit/src/index.ts`):
  `addCustomTab`, `refreshCustomTabs`, `startSubprocess`, `extendServerRpc`,
  `onDevToolsInitialized`.
- **Client kit subpaths**: `@nuxt/devtools-kit/iframe-client`
  (`onDevtoolsClientConnected`, `useDevtoolsClient`), `@nuxt/devtools-kit/host-client`
  (`onDevtoolsHostClientConnected`, `useDevtoolsHostClient`). `NuxtDevtoolsClient`
  (`_types/client-api.ts`) with `rpc`, `extendClientRpc`, `renderMarkdown`,
  `renderCodeHighlight`, `colorMode`.
- **Nuxt hooks** (`packages/devtools-kit/src/_types/hooks.ts`): `devtools:before`,
  `devtools:initialized`, `devtools:customTabs`, `devtools:customTabs:refresh`,
  `devtools:terminal:register|write|remove|exit`, runtime `devtools:terminal:data`.
- **Custom tabs**: `ModuleCustomTab` (`_types/custom-tabs.ts`) with iframe/launch/
  vnode views; `ModuleOptions.customTabs`.
- **Subprocess**: `startSubprocess(execaOptions, tabOptions, nuxt?)`
  (`src/index.ts`), returns `{ getProcess (deprecated), getResult, terminate,
  restart, clear }`.

### nostics (diagnostics library) — the deprecation engine

`nostics@1.1.4` (dep of devframe & devtools-kit). Two ways to use it:

- **Standalone catalog** (works pre-connect, prints to terminal):
  ```ts
  import { createConsoleReporter, defineDiagnostics } from 'nostics'
  const diagnostics = defineDiagnostics({
    docsBase: (code) => `https://devtools.nuxt.com/e/${String(code).toLowerCase()}`, // confirm canonical URL
    reporters: [createConsoleReporter()], // default method: 'warn'
    codes: {
      NDT_DEP_0001: {
        why: (p) => `\`${p.api}\` is deprecated.`,
        fix: (p) => `Use \`${p.replacement}\` instead.`,
      },
    },
  })
  diagnostics.NDT_DEP_0001({ api: 'x', replacement: 'y' })        // warns, returns a throwable Diagnostic
  throw diagnostics.NDT_DEP_0001({ api: 'x', replacement: 'y' })  // hard-break variant (error path)
  diagnostics.NDT_DEP_0001({ ... }, { method: 'error' })          // per-call severity override
  ```
  - Definition shape: `{ why: string|((p)=>string), fix?: string|((p)=>string), docs?: string|false }`. **No `level`** field — severity is chosen per call via the reporter `method`.
- **Register into the DevTools host** (so deprecations also surface *inside*
  DevTools) after connect, via `nuxt.devtools.devtoolsKit.diagnostics`:
  ```ts
  const cat = ctx.diagnostics.defineDiagnostics({ docsBase, codes }) // host supplies its ANSI reporter
  ctx.diagnostics.register(cat)
  // later: throw ctx.diagnostics.logger.NDT_DEP_0001({...}) / cat.NDT_DEP_0001({...})
  ```
  `DevframeDiagnosticsHost` = `{ logger, register(defs), defineDiagnostics(opts) }`.

Existing ad-hoc deprecation warnings to fold into this: the `startSubprocess`
`getProcess()` `console.warn` (`packages/devtools-kit/src/index.ts` ~line 126)
and the `logger.warn` in `packages/devtools/src/server-rpc/index.ts` (the
`disableAuthorization` notice, ~lines 165‑168), and the `disableAuthorization`
warning in `module-main.ts`.

## Decisions (locked)

1. **Expose devframe-native API as first-class connect-safe hosts** on
   `nuxt.devtools`: `nuxt.devtools.docks`, `.terminals`, `.messages`,
   `.commands`, `.diagnostics` — proxies that resolve to `devtoolsKit.*` once
   connected and **queue pre-connect calls** (mirroring `pendingBroadcasts`).
   Keep the raw `devtoolsKit` as an escape hatch.
2. **Self-discoverable deprecations** via a Nuxt nostics catalog
   (`defineDiagnostics` with `createConsoleReporter()` + `docsBase` → Nuxt docs),
   **also registered into the DevTools host diagnostics after connect** so they
   appear in DevTools too. Warn-only by default; each code carries `why` + `fix`
   + doc link.
3. **Shim-first** compatibility: every existing API keeps working this major via
   shims forwarding to devframe; deprecations are warn-only; removal deferred to
   the next major. **Hard-break only where a faithful shim is infeasible** —
   those emit an **error-level** diagnostic naming the exact replacement.

## Implementation

### Step 1 — connect-safe devframe host accessors on `nuxt.devtools`

In `packages/devtools/src/server-rpc/index.ts` (`setupRPC`) — where the context
and `pendingBroadcasts` queue already live:

- Add `docks`, `terminals`, `messages`, `commands`, `diagnostics` to the
  `NuxtDevtoolsServerContext` (extend the type in
  `packages/devtools-kit/src/_types/server-ctx.ts`).
- Implement each as a small proxy/wrapper: when `devtoolsKitCtx` is set, forward
  to `devtoolsKitCtx.<host>`; when not, either (a) buffer mutating calls
  (register/add/start…) into a queue flushed in `connectDevToolsKit`, or (b)
  return a thenable/guarded stub. Prefer buffering for the register/add/start
  methods and reads returning empty until connected.
- Keep `devtoolsKit` getter as the raw escape hatch.
- Document these as the **forward path** in `docs/`.

### Step 2 — the Nuxt deprecation diagnostics catalog

- Add a module, e.g. `packages/devtools-kit/src/diagnostics.ts` (exported so both
  the kit and the app can emit), that builds the standalone catalog with
  `defineDiagnostics({ docsBase, reporters:[createConsoleReporter()], codes })`.
  Reserve a code range/prefix: `NDT_DEP_xxxx` for deprecations (and maybe
  `NDT_xxxx` for other diagnostics later).
- Provide a tiny `deprecate(code, params, opts?)` helper wrapping the handle call
  (default warn; `opts.method:'error'` for hard-breaks).
- After connect (in `connectDevToolsKit`), also `ctx.diagnostics.register(cat)`
  (or re-define via `ctx.diagnostics.defineDiagnostics` and register) so codes
  are known to DevTools and post-connect emissions surface in the DevTools
  diagnostics UI. Guard for `diagnostics` host availability.
- Confirm the canonical docs URL scheme with maintainers (e.g.
  `https://devtools.nuxt.com/e/<code>` or a migration guide anchor); wire it into
  `docsBase`.

### Step 3 — shim pattern + deprecation classification map

Establish the pattern (used by plans 01/02/03): keep the old API; internally
forward to the devframe host; emit the deprecation diagnostic once per unique
call site (dedupe by code+key to avoid noise). Ship this **classification map**
(implemented incrementally by the owning plans):

| Nuxt API | devframe-native path | Policy | Owner |
|---|---|---|---|
| `devtoolsUiShowNotification` | `messages` host (`add`/`info`/…) | shim + deprecate | Plan 01 |
| `startSubprocess`, `devtools:terminal:*` hooks | `terminals` host (`register`/`startChildProcess`/`startPtySession`) | shim + deprecate | Plan 02 |
| `startSubprocess().getProcess()` | `getResult()` | already deprecated → move to nostics code | Plan 00 (pilot) |
| `addCustomTab` / `devtools:customTabs` / `ModuleCustomTab` | stays (Nuxt-native); gains `dock:true` → `docks` | **keep** (extend, not deprecate) | Plan 03 |
| `extendServerRpc`, `rpc.broadcast`, `rpc.functions` | `ctx.rpc` (`register`/`defineRpcFunction`/`broadcast`) | keep + expose; low-urgency soft-deprecate later | Plan 00 exposes; future |
| client `extendClientRpc`, `useDevtoolsClient`, `onDevtoolsClientConnected` | devframe client RPC | keep + shim | future |
| `onDevToolsInitialized`, `devtools:before/initialized` | Nuxt lifecycle | **keep** (no devframe equivalent) | — |
| `disableAuthorization` option | handled by Vite DevTools auth | already warned → move to nostics code (**breaking**, error-level) | Plan 00 (pilot) |

### Step 4 — pilot deprecations (prove the mechanism)

- Replace the `getProcess()` `console.warn` (`devtools-kit/src/index.ts`) with a
  `NDT_DEP_xxxx` warn diagnostic.
- Replace the `disableAuthorization` `logger.warn` (`server-rpc/index.ts` /
  `module-main.ts`) with a diagnostic (error-level — it no longer does anything).
- These validate both reporting paths (pre-connect console + post-connect host).

## Acceptance criteria

- `nuxt.devtools.terminals` / `.messages` / `.docks` / `.commands` /
  `.diagnostics` are usable from a module's setup (calls made before the kit
  connects are queued and applied after connect; no crashes when `devtoolsKit`
  is still undefined).
- Using a deprecated API prints a terminal warning with a **code**, a **fix**,
  and a **doc link**, and the same deprecation is visible inside DevTools'
  diagnostics after connect.
- The two pilot deprecations fire correctly (getProcess → warn; disableAuthorization → error).
- `pnpm lint && pnpm build && pnpm typecheck` pass.
- No existing module integration breaks solely due to this plan (shims in place;
  plans 01/02/03 attach their specific shims).

## Risks / gotchas

- **Connect timing.** The hosts are undefined pre-connect; buffer mutating calls
  and flush on `connectDevToolsKit` (reuse the `pendingBroadcasts` pattern).
- **Diagnostic noise.** Dedupe deprecation emissions (once per code+key) so a
  hot path doesn't spam the console.
- **Docs URL.** `docsBase` must point at real pages or the "see:" link is dead —
  confirm the scheme and create stubs/redirects before shipping.
- **Prod stripping.** nostics supports `defineProdDiagnostics` + a strip plugin;
  DevTools is dev-only so this is optional, but keep `why`/`fix` out of any
  shipped runtime if size matters.
- **Don't over-deprecate.** Custom tabs and the Nuxt lifecycle hooks have no
  clean devframe equivalent yet — keep them; only deprecate where the map says so.
