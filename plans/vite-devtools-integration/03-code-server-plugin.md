# Plan 03 - Replace VS Code integration with the Code Server plugin

**Status:** ready after Plan 01; **Risk:** medium; **Depends on:** Plan 01
(`NUXT_DEVTOOLS_GROUP_ID` and selected ready context)
**Outcome:** the bespoke custom tab and process supervisor are removed.
`@devframes/plugin-code-server` supplies a Nuxt-group dock that detects and
starts Coder `code-server` on demand.

## Product boundary

This is an intentional breaking capability reduction. The replacement supports
the plugin's contract only:

- Coder `code-server`;
- local binary detection;
- on-demand start;
- authenticated iframe handoff;
- process output in Devframe Terminals.

It does not preserve Microsoft `code serve-web`, Microsoft `code-server
serve-local`, tunnels, existing-server reuse, start-on-boot, controller-extension
installation, or opening a specific file through that extension.

The existing generic `launch-editor` path remains available for normal
open-in-editor behavior.

## Drift check

Verify before editing:

1. `packages/devtools/src/integrations/vscode.ts` still owns the custom tab,
   process spawning, tunnel, reuse, and editor controller hook.
2. `ModuleOptions.vscode` and `defaultOptions.vscode` still exist.
3. `@devframes/plugin-code-server` latest compatible 0.7 release still exports
   `createCodeServerDevframe(options)`.
4. `mountDevframe` is still exported from `@vitejs/devtools-kit/node` and accepts
   per-mount `dock` overrides including `groupId`.
5. The plugin still supports only Coder's `code-server` CLI contract.
6. `setupCodeServer` and its supervisor `dispose()` remain public in the plugin's
   Node entry, because 0.7.5's default definition only cleans up on process exit.
7. `packages/devtools/package.json` declares Vite 8 after Plan 01.

**STOP:** if the plugin no longer peers with the repository's resolved
`devframe` version, align the whole Devframe family first. Do not install two
runtime versions to satisfy it.

## Public option

Replace the old option with:

```ts
export interface CodeServerIntegrationOptions {
  /** @default true */
  enabled?: boolean
  bin?: string
  cwd?: string
  serverPort?: number
  host?: string
  args?: string[]
  env?: Record<string, string>
  cookieSuffix?: string
  startTimeout?: number
}

export interface ModuleOptions {
  codeServer?: CodeServerIntegrationOptions
  /** @deprecated Use `codeServer`. Legacy modes are no longer supported. */
  vscode?: VSCodeIntegrationOptions
}
```

Expose only the runtime subset above. Do not expose `basePath`, `distDir`, CLI
`command`, launcher `port`, `portRange`, or `random` from the plugin options.
Use the plugin's defaults, including its default code-server port behavior,
unless the user configures a field.

Validate the two escape-hatch fields before setup. Reject `args` entries that
override `--auth`, `--bind-addr`, or `--cookie-suffix`, and reject `env` keys
`PASSWORD` or `HASHED_PASSWORD`; users configure host and cookie suffix through
their dedicated fields. Do not let pass-through options bypass the plugin's
generated authentication.

## Implementation

### 1. Add aligned dependencies

Add `@devframes/plugin-code-server: ^0.7.5` to the appropriate pnpm catalog and
to `packages/devtools` runtime dependencies. Keep `devframe`,
`@devframes/hub`, and any already-landed official plugin versions aligned at
`^0.7.5`. Add only this plan's plugin; preserve dependencies landed by other
plans. Refresh the lockfile and resolve any peer warning rather than suppressing
it.

### 2. Replace defaults and emit one migration diagnostic

- Remove `vscode` from `defaultOptions` so merely applying module defaults does
  not look like explicit legacy configuration.
- Add `codeServer: { enabled: true }`.
- Keep the deprecated `vscode` type for the v4 migration window.
- If a user supplies `vscode`, emit reserved code `NDT_DEP_0008` once with a
  migration-guide link, then ignore the entire value.

Do not translate old fields. Mapping only part of a tunnel/reuse/MS
configuration would look successful while changing behavior silently.

### 3. Mount the plugin into the connected hub

Replace `integrations/vscode.ts` with a small Code Server integration or create a
new accurately named file and delete the old one. In its setup:

1. In `module-main.ts`, replace the current `options.vscode?.enabled` loader
   condition with an unconditional Code Server integration setup call. The
   integration itself owns disabled behavior.
2. Return without mounting only when `options.codeServer?.enabled === false`.
3. Validate and pass the curated fields to `createCodeServerDevframe()`.
4. Default `cwd` to `nuxt.options.rootDir` when the user does not provide it.
5. Mount the definition from `onDevtoolsReady` using `mountDevframe()`. Because
   the 0.7.5 definition discards its supervisor and cleans up only on
   `process.exit`, clone its definition with a setup callback that delegates to
   public `setupCodeServer(ctx, options)` from
   `@devframes/plugin-code-server/node` and retains the returned supervisor.
   Dispose that supervisor from `nuxt.hook('close')`. The original definition's
   setup does only this delegation, so replace it rather than running both. Do
   not copy supervisor implementation into Nuxt.
6. Override the dock with `groupId: NUXT_DEVTOOLS_GROUP_ID` and
   `category: 'framework'` and `defaultOrder: -200`. Keep the plugin's own dock
   ID and bundled SPA path.

The plugin performs binary detection during setup and does not start a process
until its Start action. Do not duplicate detection, readiness polling, auth
cookies, terminal registration, or process state in Nuxt.

The 0.7.5 bundled UI has no user-facing Stop action. Do not document one. Nuxt
close cleanup is lifecycle hygiene, not an added panel control.

### 4. Delete the bespoke integration

Remove all code used only by `integrations/vscode.ts`, including:

- the `devtools:customTabs` contribution;
- binary variant tables;
- tunnel and reuse logic;
- `.vscode/.server-controller-port.log` handling;
- controller extension installation;
- the Code Server-specific `openInEditorHooks` entry;
- `get-port-please`, `which`, hostname/path/fs imports or dependencies when no
  other code uses them.

Do not remove the generic editor settings or `launch-editor` dependency.

### 5. Update user-facing documentation

Replace examples in `README.md`, `docs/content/1.guide/0.getting-started.md`, and
`docs/content/1.guide/1.features.md` that use `vscode` with `codeServer`. Add the
`NDT_DEP_0008` section to `docs/content/2.module/3.migration-v4.md`; list every
removed mode and state that there is no compatibility translation. Link to
Coder's `code-server` installation instructions, not the Microsoft VS Code
Server guide.

Replace the obsolete Microsoft `code-server serve-local` example in
`docs/content/2.module/1.utils-kit.md` with a neutral
`ctx.terminals.startChildProcess()` example; do not imply that the removed
Microsoft mode remains supported.

Document:

- enabled-by-default detection;
- on-demand startup;
- the curated options and plugin defaults;
- direct-port iframe/network expectations;
- that HTTPS, reverse proxies, and remote forwarding are governed by the
  experimental upstream plugin and are not extended by Nuxt.

## Acceptance criteria

- With no module option, the Nuxt group contains a Code Server member.
- Without `code-server` installed, opening the member shows the plugin's install
  state and does not throw or start a process.
- With Coder `code-server` installed, Start launches it in the Nuxt root,
  authenticates the iframe, and exposes process output in built-in Terminals.
- `codeServer.enabled: false` omits the member.
- Every curated field reaches `createCodeServerDevframe`; mount/CLI internals are
  absent from Nuxt's public type.
- Reserved auth/bind overrides are rejected with an actionable error.
- Closing Nuxt disposes a Code Server process started by this integration.
- Supplying `vscode` emits one actionable diagnostic and does not start or mount
  the legacy integration.
- No `builtin-vscode` custom tab, tunnel code, controller file, or obsolete
  dependency remains.

## Verification

Add unit tests for option projection, disabled behavior, defaults, and legacy
diagnostic deduplication. Add a dev e2e assertion for the detected-not-installed
state; do not make CI install code-server. Then run the shared commands and:

```sh
pnpm test:e2e:dev
```

Perform the installed-binary startup/auth test manually or in an opt-in fixture.

## STOP conditions

- The plugin's iframe cannot load through Nuxt's configured `app.baseURL` or the
  mounted connection metadata. Fix the mount/base integration; do not restore a
  custom Nuxt iframe.
- Starting Code Server requires an upstream plugin patch. Keep that patch in the
  Devframe project or pin a released fix; do not fork its supervisor into Nuxt.
- A removed Microsoft/tunnel/reuse mode is found to be a release blocker. Split
  that decision into a separately approved integration rather than silently
  retaining branches in this replacement.
