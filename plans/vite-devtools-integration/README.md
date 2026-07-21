# Nuxt DevTools and Devframe 0.7 integration plans

This folder contains four implementation plans for `@vitejs/devtools-kit` 0.4.2
and Devframe 0.7.5. They replace the earlier Devframe 0.6 plans, which no longer
matched the repository: Messages had mostly landed, terminals were split across
two systems, and the proposed dynamic dock promotion depended on lifecycle APIs
that Devframe does not expose.

Each plan is written for a fresh implementation agent. Read the whole selected
plan, run its drift check, and honor its STOP conditions. A plan may depend on a
landed predecessor, but does not require reading the other plan files.

## Target state

Nuxt DevTools becomes a first-class `Nuxt` framework group in Vite DevTools:

- `nuxt:devtools` remains the default group member and keeps its complete
  internal SideNav.
- `@devframes/plugin-code-server` replaces the bespoke VS Code server tab.
- `@devframes/plugin-data-inspector` replaces the DiscoveryJS-based Nuxt
  Options Viewer with one preconfigured, live `Nuxt Application` source.
- Messages and terminals use the Devframe 0.7 host services without duplicate
  Nuxt UI implementations.

The group does **not** hoist Nuxt's built-in pages into separate iframes. There
is no `dock: true` custom-tab bridge. Module authors join the group through the
native dock API and the exported `NUXT_DEVTOOLS_GROUP_ID`:

```ts
import { NUXT_DEVTOOLS_GROUP_ID, onDevtoolsReady } from '@nuxt/devtools-kit'

onDevtoolsReady((ctx) => {
  ctx.docks.register({
    id: 'my-module',
    type: 'iframe',
    title: 'My Module',
    icon: 'i-ph-puzzle-piece',
    url: '/my-module/',
    groupId: NUXT_DEVTOOLS_GROUP_ID,
  })
})
```

## Verified platform facts

- The root lockfile resolves `@vitejs/devtools-kit` and `@vitejs/devtools` to
  0.4.2 and `devframe` / `@devframes/hub` to 0.7.5.
- The target integration requires Vite 8. Code Server 0.7.5 peers only with
  Vite 8, so retaining the package's old Vite 6+ peer range would be misleading.
- A dock group is `{ type: 'group', id, title, icon, defaultChildId? }`; members
  point to it with `groupId`. Membership is one level deep and orphan-tolerant.
- `ctx.docks.register()` can update an entry but cannot unregister it. An open
  iframe also does not navigate when its registered URL changes. These gaps are
  why dynamic custom-tab promotion is out of scope.
- `mountDevframe()` is re-exported from `@vitejs/devtools-kit/node`. It serves a
  Devframe SPA, mounts connection metadata, registers its iframe dock, and runs
  the definition's setup against the existing hub.
- `@devframes/plugin-code-server` 0.7.5 supports on-demand Coder `code-server`.
  It does not support Microsoft server variants, tunnels, existing-server reuse,
  start-on-boot, or the old controller extension.
- `@devframes/plugin-data-inspector` 0.7.5 has a process-global source registry.
  A non-static factory is resolved on every query. The query engine handles
  circular and exotic values, so the old JSON serialization layer is needless.
- The public terminals host can register external output streams, but cannot
  remove them or expose restart/terminate actions for externally owned sessions.
  The compatibility bridge is therefore output/status only.

## Plans and order

| # | Plan | Outcome | Depends on | Parallel with |
|---|---|---|---|---|
| 01 | [`01-dock-foundation.md`](./01-dock-foundation.md) | Select the correct Nuxt client Vite context and register/export the Nuxt group. | landed v4 foundation | 02 |
| 02 | [`02-platform-services-cleanup.md`](./02-platform-services-cleanup.md) | Repair Messages transport and finish terminal convergence. | landed v4 foundation | 01 |
| 03 | [`03-code-server-plugin.md`](./03-code-server-plugin.md) | Replace the built-in VS Code integration with the Code Server plugin. | 01 | 04 (implementation only) |
| 04 | [`04-data-inspector-plugin.md`](./04-data-inspector-plugin.md) | Replace DiscoveryJS with the Data Inspector plugin and Nuxt source. | 01 | 03 (implementation only) |

Recommended landing order: **01 and 02 in either order, then 03, then 04**.
Plans 03 and 04 may be implemented in parallel, but both edit the package
manifest, workspace catalog, and lockfile. Land them serially; rebase the second
PR and regenerate its lockfile. Both rely on the group constant and deterministic
ready context from Plan 01. Their Devframe docks would be orphan-tolerant at
runtime, but their source code should not duplicate the group ID.

## Locked decisions

- Use stable group ID `nuxt`, title `Nuxt`, category `framework`, and
  `nuxt:devtools` as `defaultChildId`.
- Use default order `-900` for the group and member orders `-300` for the hub,
  `-200` for Code Server, and `-100` for Data Inspector.
- Keep every built-in Nuxt page in the hub SideNav; do not create shell-less
  duplicate Nuxt clients.
- Drop the proposed custom-tab `dock: true` API. Native `ctx.docks` is the only
  public extension path.
- Replace `vscode` with a curated `codeServer` module option. Keep `vscode` only
  long enough to emit a migration warning, then ignore it.
- Mount Code Server by default, detect the binary immediately, and start it only
  when the user requests it.
- Always mount Data Inspector, disable its example source, and register one live
  source containing Nuxt options, Nitro options, and client/SSR Vite configs.
- Do not add Nuxt wrappers around Data Inspector source registration or Devframe
  terminals. Ecosystem modules use those platform APIs directly.
- Keep the legacy terminal hooks and `startSubprocess` output bridge through v4,
  with existing deprecations. Remove the bridge in v5.
- Reserve `NDT_DEP_0008` for the removed `vscode` option. The terminal bridge
  keeps the existing `NDT_DEP_0001` / `NDT_DEP_0004` diagnostics rather than
  double-warning `startSubprocess` through its underlying hook.
- Give every Nuxt-owned process run a unique session ID. Retain completed output
  for the life of the dev server because Devframe 0.7 cannot unregister sessions.
- Use caret `^0.7.5` catalog entries and keep all Devframe packages aligned when
  updating the lockfile.
- Narrow `@nuxt/devtools`' Vite peer range to Vite 8 before adding the plugins.

## Shared verification

Every implementation PR must run:

```sh
pnpm install
pnpm lint
pnpm build
pnpm typecheck
pnpm test:unit
```

Run the plan-specific e2e command in addition. `pnpm build` or `pnpm prepare`
must precede `pnpm typecheck` because the root tsconfig extends the generated
Nuxt client config.

Use one Conventional Commit and one PR per plan. The final PR description line
must state that the PR was created with the help of an agent.
