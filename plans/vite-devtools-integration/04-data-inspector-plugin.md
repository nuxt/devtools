# Plan 04 - Replace Server Discovery with Data Inspector

**Status:** ready after Plan 01; **Risk:** medium; **Depends on:** Plan 01
(`NUXT_DEVTOOLS_GROUP_ID` and selected ready context)
**Outcome:** the DiscoveryJS bundle, nested iframe, serialization RPC, and build
step are removed. A Devframe Data Inspector member queries one live,
preconfigured `Nuxt Application` source.

## Product boundary

Data Inspector replaces only the read-only Nuxt Options Viewer currently served
by `client/pages/modules/server-discovery.vue`.

It does not replace:

- `getServerConfig`, which has other client consumers;
- the editable Runtime Config tool;
- Nitro Storage or any mutation RPC;
- schema generation;
- module-specific source registration APIs.

The panel is always mounted when Nuxt DevTools is enabled. There is no new
`dataInspector` module option. Ecosystem modules that want more sources install
`@devframes/plugin-data-inspector` themselves and use its native
`registerDataSource`; Nuxt does not add a hook or re-export.

## Drift check

Verify before editing:

1. the old page still embeds `discovery/index.html` and calls `getServerData`;
2. `server-rpc/server-data.ts` still captures Nitro and both Vite configs;
3. `getServerConfig` also exists in `server-rpc/general.ts` and has consumers;
4. DiscoveryJS build scripts, config, dependencies, and catalog entries still
   exist;
5. `@devframes/plugin-data-inspector` still exports
   `createDataInspectorDevframe` and `registerDataSource`;
6. source entries still accept a non-static data factory and suggested queries;
7. supported fixtures do not run multiple active Nuxt DevTools instances in one
   Node process, because the 0.7 registry is process-global rather than
   host-scoped;
8. Nuxt 4.4's typed `vite:configResolved` hook still fires once with
   `{ isClient: true }` and once with `{ isServer: true }` in both serial and
   Environment API modes.

**STOP:** if Data Inspector's registry is no longer shared with the mounted
definition or its query engine cannot normalize actual Nuxt/Vite objects, create
a minimal upstream reproduction. Do not restore manual circular JSON encoding
inside the new integration.

## Source contract

Register exactly one source:

```ts
{
  id: 'nuxt:application',
  title: 'Nuxt Application',
  description: 'Live Nuxt, Nitro, and Vite configuration',
  icon: 'i-ph:database-duotone',
  static: false,
  data: () => ({
    nuxt: nuxt.options,
    nitro: nitro?.options,
    vite: {
      client: viteClient,
      ssr: viteSsr,
    },
  }),
  queries: [
    { title: 'Overview', query: '', excludeFunctions: true },
    { title: 'Nuxt options', query: 'nuxt', excludeFunctions: true },
    { title: 'Nitro options', query: 'nitro', excludeFunctions: true },
    { title: 'Vite configs', query: 'vite', excludeFunctions: true },
  ],
}
```

Use raw live objects. Data Inspector owns normalization, circular references,
depth limits, and lazy expansion. Suggested queries should default to
`excludeFunctions: true` so browsing configuration does not foreground methods;
custom user queries remain unrestricted.

Provide the four exact read-only suggested queries shown above:

1. **Overview** - the root application object.
2. **Nuxt options** - `nuxt`.
3. **Nitro options** - `nitro`.
4. **Vite configs** - `vite`.

The empty string is Data Inspector 0.7.5's whole-root query. Do not substitute
`$` or add saved queries on the user's behalf.

## Implementation

### 1. Add aligned dependencies

Add `@devframes/plugin-data-inspector: ^0.7.5` to the appropriate pnpm catalog
and `packages/devtools` runtime dependencies. Keep it aligned with `devframe`,
`@devframes/hub`, and any already-landed official plugins at `^0.7.5`. Add only
this plan's plugin; preserve dependencies landed by other plans. Refresh the
lockfile and resolve peer warnings.

### 2. Turn server-data collection into source state

Create `packages/devtools/src/integrations/data-inspector.ts`, move the capture
logic there, and delete `server-rpc/server-data.ts`. Remove
`setupServerDataRPC(ctx)` from `server-rpc/index.ts`, then invoke the new
integration unconditionally from `module-main.ts` alongside the other built-in
integrations.

Keep the hook that captures `nitro.options` from `nitro:build:before`. Delete the
current `addVitePlugin({ applyToEnvironment() { ...configResolved... } })`
capture: Vite 8 resolves those returned environment plugins after top-level
`configResolved`, so it is not a reliable collection path.

Instead, register Nuxt's typed `vite:configResolved` hook directly. Store the
raw config as `viteClient` when `env.isClient` and as `viteSsr` when
`env.isServer`. Nuxt 4.4 fires this hook for both serial Vite servers and both
Environment API projections, so the source contract remains exactly
`vite: { client, ssr }`. Although Nuxt marks the hook deprecated, it is the only
current host API that reports both configs semantically; the drift check must
find its supported replacement before removing it.

Delete `normalizeViteConfig`; the Data Inspector engine normalizes values for
transport and therefore avoids the existing `config.env`/`config.environments`
bug entirely.

Register the source early with a live factory, so Nuxt options are immediately
available and Nitro/Vite fields populate as the Nuxt hooks run. Keep the unregister
closure and call it from Nuxt's close hook to avoid leaking a process-global
source in tests.

Devframe 0.7's registry is process-global and not host-scoped. This plan supports
one active Nuxt DevTools instance per Node process, using the fixed
`nuxt:application` ID. Add that precondition to the drift test. If supported
fixtures run multiple active Nuxt instances in one process, hit the STOP
condition: namespacing IDs alone would still leak every source into every host.

### 3. Mount Data Inspector in the Nuxt group

Create the definition with its example source disabled:

```ts
createDataInspectorDevframe({ exampleSource: false })
```

Mount it once from `onDevtoolsReady` through `mountDevframe()`, overriding the
dock with `groupId: NUXT_DEVTOOLS_GROUP_ID`, `category: 'framework'`, and
`defaultOrder: -100`. The category override is required because the definition
defaults to `~builtin`; group members do not inherit their group's category.
Keep the plugin-native dock ID and RPC namespace; do not create multiple
inspector instances or customize an ID that still shares hard-coded service
names.

The definition's bundled SPA is the complete UI. Do not embed it in a Nuxt page
or add a client component wrapper.

### 4. Remove the old Discovery surface

Delete:

- `client/pages/modules/server-discovery.vue`;
- `getServerData` from server functions and RPC types;
- `NuxtServerData` if no longer used;
- `jsonStringifyCircular` if the search confirms no remaining caller;
- `packages/devtools/.discoveryrc.cjs`;
- `build:discovery` and `dev:discovery` scripts;
- Discovery build invocations from `build` and `dev`;
- `@discoveryjs/cli` and `@discoveryjs/discovery` package/catalog entries when
  unused;
- generated/public Discovery assets tracked by the package.

Keep `getServerConfig` in `server-rpc/general.ts` and verify all existing callers
still compile. Do not conflate the duplicate old `getServerConfig` return in
`server-data.ts` with the canonical general RPC.

### 5. Update documentation and tests

- Add the outer Nuxt-group Data Inspector member to
  `docs/content/1.guide/1.features.md`; there are no current Discovery docs or
  screenshots to migrate.
- Explain the three root fields, live-query behavior, the four presets, and the
  fact that custom queries can invoke reachable functions or getters.
- Mention Data Inspector's built-in optional polling toggle (5s default,
  clamped 1-3600s, pauses in background tabs) as a feature of the bundled
  Devframe SPA — it is upstream UI, not something this plan implements; it
  needs no Nuxt-side wiring, refresh trigger, cleanup, or tests.
- Direct module authors to the upstream package and registry API rather than a
  Nuxt wrapper.
- Add unit tests for source shape before and after Nitro/Vite hook capture, source
  unregistration, `static: false`, and all four query presets.
- Add a dev e2e test that opens the grouped Data Inspector, sees only the Nuxt
  source (not the example), and queries at least `nuxt` and `vite`.

## Acceptance criteria

- The Nuxt group contains one Data Inspector member whenever DevTools is enabled.
- Its source picker contains `Nuxt Application` and no built-in example source.
- The source returns current Nuxt options, later-populated Nitro options, and
  Vite 8 client/SSR environment configs without pre-stringifying them.
- All four suggested queries run successfully with function exclusion enabled.
- The old SideNav Nuxt Options Viewer is gone.
- DiscoveryJS packages, configuration, static bundle, build scripts, RPC, and
  circular JSON utility are gone when unused.
- Runtime Config editing, Storage editing, and all `getServerConfig` consumers
  continue to work.
- Registering a source through the upstream registry from a fixture module makes
  it appear in the same inspector without any Nuxt-specific API.

## Verification

Run, using pnpm 11 (this repo's pinned `packageManager`, not npm or yarn):

```sh
pnpm lint
pnpm build   # or `pnpm prepare` — either must run before `pnpm typecheck`
pnpm typecheck
pnpm test:unit
pnpm test:e2e:dev
pnpm docs:build
```

Manually leave Data Inspector open while the Nuxt capture hooks complete and
rerun the query to confirm the non-static factory reflects current state.

## STOP conditions

- Raw Nuxt/Vite objects crash or hang normalization at practical query limits.
  Reduce the failing branch with an upstream test before choosing targeted
  sanitization; do not reinstate whole-object JSON cloning.
- A supported fixture runs multiple active Nuxt DevTools instances in one Node
  process. Stop and define host-scoped upstream registry semantics; namespaced
  IDs alone do not prevent cross-host source leakage.
- The plugin's saved-query storage writes to an unexpected scope. Treat that as
  an upstream host-storage issue; it is not a reason to keep DiscoveryJS.
