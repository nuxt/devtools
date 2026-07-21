# Plan 01 - Establish the Nuxt dock foundation

**Status:** ready to execute; **Risk:** medium; **Depends on:** the v4 ready-hook
and diagnostics foundation already on main
**Outcome:** Nuxt DevTools consistently connects its RPC surface to the
browser-serving Nuxt Vite context and appears as the default child of a stable,
public `Nuxt` framework group.

## Why this plan exists

`packages/devtools/src/module-main.ts` installs the Nuxt dock plugin into both
Nuxt Vite contexts. `connectDevToolsKit()` in
`packages/devtools/src/server-rpc/index.ts` currently keeps whichever context
calls it first. The comment assumes that is the client context; the code does
not verify it. If setup order changes, the server context can win despite having
no browser RPC peers.

Kit 0.4.2 exposes `ctx.viteConfig` and `ctx.viteServer`, so selection can be
based on the resolved Vite context rather than callback order. This is required
before mounting more Devframes onto `devtools:ready`.

`packages/devtools/src/integrations/vite-inspect.ts` separately reads
`meta.instances[0]`. Vite Inspect 12.0.2 does not expose a discriminator that can
map those instances back to a Nuxt client/SSR config: both report client and SSR
environment names. Do not reuse the context classifier there or claim to fix
that ordering in this plan.

## Drift check

Before editing, verify all of the following:

1. `pnpm-lock.yaml` resolves `@vitejs/devtools-kit` to 0.4.2 and Devframe hub to
   0.7.5.
2. `module-main.ts` still calls `connectDevToolsKit(ctx)` from the
   `nuxt:devtools` plugin's `devtools.setup` callback.
3. `server-rpc/index.ts` still has `if (devtoolsKitCtx) return` with a
   first-client comment.
4. The context type still exposes required `viteConfig` and optional
   `viteServer`.
5. Nuxt's Vite 8 client and SSR resolved configs differ through `build.ssr`,
   even though both expose `client` and `ssr` environment names.

**STOP:** if Kit no longer supplies enough resolved-config information to tell
Nuxt's client and SSR contexts apart, do not invent another timing heuristic.
Capture the observed context metadata in a fixture and revise this plan or fix
the upstream integration first.

## Scope

This plan includes:

- deterministic client-context selection;
- narrowing `@nuxt/devtools`' peer contract to Vite 8;
- the `Nuxt` group and hub membership;
- a public group ID constant;
- focused unit and e2e coverage.

This plan does not mount Code Server or Data Inspector, promote Nuxt pages,
change the SideNav, add `dock: true` to custom tabs, or guess which Vite Inspect
metadata instance is the client. File or link an upstream Vite Inspect issue for
the missing discriminator.

## Implementation

### 1. Add and export the group constant

In `packages/devtools-kit/src/index.ts`, export:

```ts
export const NUXT_DEVTOOLS_GROUP_ID = 'nuxt'
```

Use this constant everywhere Nuxt-owned code registers a group member. Do not
add a second constants module or duplicate the string in later integrations.
Add a short TSDoc example showing `ctx.docks.register({ groupId:
NUXT_DEVTOOLS_GROUP_ID, ... })` so module authors have a native extension path.

### 2. Select the browser-serving Vite context

Replace the first-context guard in `connectDevToolsKit()` with a small,
unit-testable Vite 8 classifier for `ctx.viteConfig`. Check `build.ssr` before
looking at environment names because Vite 8 exposes both names on each config.
Lock this truth table:

| Signal | Classification |
|---|---|
| `config.build.ssr` is truthy | SSR |
| `config.command === 'serve'` and `config.build.ssr` is falsy | client |
| missing config or any other combination | unknown |

Do not classify from `config.environments`, WebSocket client count, or callback
order.

Ignore the SSR candidate without assigning `devtoolsKitCtx`. Connect exactly
once when the client candidate arrives, then register RPC, diagnostics, flush
broadcasts, and fire `devtools:ready` as today.

An unknown candidate must not assign `devtoolsKitCtx`. Emit one actionable
diagnostic/log that includes the available command, environment names, and SSR
marker. If every supported fixture is unknown, hit the STOP condition rather
than reconnecting first-wins.

Put the classifier near `connectDevToolsKit()` unless tests require exporting it
from a small internal utility. Do not introduce a general context registry.

### 3. Make the Vite 8 requirement explicit

Change `packages/devtools/package.json` from `vite: ">=6.0"` to `vite:
"~8.0.14"`, matching the root override that deliberately excludes Vite 8.1
until its WebSocket regression is fixed. Update compatibility documentation. Do
not narrow
`@nuxt/devtools-kit` unless its own API now requires Vite 8; the plugin peer
constraint belongs to the package that installs the Devframe plugins.

Leave `integrations/vite-inspect.ts` unchanged and record its index-zero behavior
as a residual risk with an upstream discriminator prerequisite.

### 4. Register the group and hub member

In `module-main.ts`'s existing `devtools.setup(ctx)` callback, register the group
before the hub iframe:

```ts
ctx.docks.register({
  id: NUXT_DEVTOOLS_GROUP_ID,
  type: 'group',
  title: 'Nuxt',
  icon: '/__nuxt_devtools__/client/nuxt.svg',
  category: 'framework',
  defaultOrder: -900,
  defaultChildId: 'nuxt:devtools',
})
```

Add `groupId: NUXT_DEVTOOLS_GROUP_ID` to the existing `nuxt:devtools` iframe and
change its `defaultOrder` to `-300`. Keep its ID, URL, icon, and title unchanged.
Existing calls that activate or look up `nuxt:devtools`, including the single
Vue DevTools iframe bridge, must continue to target the hub member directly.

Guard **both** registrations with the same client classifier from Step 2: only
call `ctx.docks.register(...)` for the group and the `nuxt:devtools` member when
`ctx` is the selected client candidate. Today's code registers `nuxt:devtools`
unconditionally in `devtools.setup(ctx)`, so it already runs once per Vite
instance (client and SSR); adding the group without the same guard would create
a second, inert `Nuxt` group + hub member on the SSR context. Skip registration
entirely (do not register a disabled/hidden placeholder) when `ctx` classifies
as SSR or unknown.

The lower `defaultOrder` values sort earlier in Vite DevTools 0.4.2. Verify the
result visually rather than relying only on the stale type comment.

### 5. Update documentation and tests

- Document the group constant and native membership example in
  `docs/content/2.module/1.utils-kit.md`.
- Add unit coverage for client, SSR, unknown/missing-config, and repeated connection
  candidates. Assert `devtools:ready` fires once for the selected client.
- Update `tests/e2e/fixtures/devtools.ts` comments from Devframe 0.6 to 0.7 where
  still applicable. Keep the exact hub target `nuxt:devtools`; do not broaden the
  iframe selector.
- Add an e2e assertion that `nuxt` is a group, its default child is
  `nuxt:devtools`, and opening the hub still hydrates the SideNav.

## Acceptance criteria

- Reversing client/SSR setup order in a unit fixture still connects the client
  context and fires `devtools:ready` once.
- `@nuxt/devtools` declares Vite 8 compatibility instead of Vite 6+.
- Vite DevTools renders one `Nuxt` group in the framework category.
- Clicking the group opens `nuxt:devtools` by default.
- The hub keeps its full current SideNav, and Pinia/Render Tree retain the single
  Vue DevTools bridge without a `Connecting...` regression.
- A module can import `NUXT_DEVTOOLS_GROUP_ID` from `@nuxt/devtools-kit`.
- No `dock` field is added to custom-tab or page-meta types.
- The SSR Vite context never registers the `Nuxt` group or the `nuxt:devtools`
  member; only the selected client context does.

## Verification

Run, using pnpm 11 (this repo's pinned `packageManager`, not npm or yarn):

```sh
pnpm lint
pnpm build   # or `pnpm prepare` — either must run before `pnpm typecheck`
pnpm typecheck
pnpm test:unit
pnpm test:e2e:dev
```

Manually run one playground, open Vite DevTools, and verify the group popover,
default child, framework placement, and Vue-backed tabs.

## STOP conditions

- The selected client context has no active RPC path while another candidate
  does. Record both contexts instead of weakening selection to first-wins.
- Group registration creates duplicate Nuxt groups across environments. Fix the
  context/plugin registration boundary before adding deduplication flags.
- `build.ssr` does not distinguish the two supported Vite 8 Nuxt contexts.
  Capture both resolved configs and revise the classifier; do not fall back to
  environment names or setup order.
