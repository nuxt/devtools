# Ecosystem compatibility report

Findings from dogfooding the `modules/` playground (see [`README.md`](./README.md))
against the **local** `@nuxt/devtools` (this repo's `packages/devtools`, on
`main` at the time of testing — pre Plan 00–03, still on the `@vitejs/devtools`
0.4.0 / devframe 0.6.0 migration landed by nuxt/devtools#1010).

- **Nuxt**: `4.4.8`
- **@nuxt/devtools**: local (`../../local`, `4.0.0-alpha.7`)
- Tested by: installing the playground, running `NUXT_DEVTOOLS_LOCAL=true nuxi dev`,
  and driving a real Chromium instance (`agent-browser`) against it — including
  authorizing the Vite DevTools connection (the 6-digit `devframe auth code`
  printed in the terminal) and navigating the embedded DevTools client.

`@nuxt/content` and `@nuxt/image` were tried too, but **removed from the active
playground** after this run showed neither registers a DevTools tab in the
versions tested — there was nothing left to dogfood against. Their findings
are kept below (["Modules removed after testing"](#modules-removed-after-testing))
since they're the evidence for why they were dropped, and useful raw material
for the upstream follow-ups in [Recommendations](#recommendations).

**Addendum:** `@nuxt/devtools` in `modules/package.json` was switched from a
plain npm version range to a `link:../../packages/devtools` dependency — this
repo's own build, never the registry (see plan Decision 10). Re-verified after
that change: `nuxt build` succeeds against a stubbed `packages/devtools/dist`
(`pnpm run prepare`), and `nuxt dev` *without* `NUXT_DEVTOOLS_LOCAL` against a
fully-built one (`pnpm run build`) renders the real DevTools UI — connects,
authorizes, and opens with no console errors — giving a second way to
dogfood this repo's own code without the `../../local` HMR-subprocess
wrapper.

**Addendum 2 — Plan 00 landed on this branch, re-tested:** this feature
branch was rebased onto `main` after nuxt/devtools#1021 (devframe-native
hosts + nostics deprecation foundation) and nuxt/devtools#1023 (client RPC
registration fix) merged. Re-ran the full dogfooding pass against the
rebased tip:

- **The client RPC registration bug is fixed.** Earlier runs against
  pre-#1023 `main` logged `[DF0022] RPC function "refresh"/"callHook"/
  "onTerminalData"/"onTerminalExit"/"navigateTo" is not registered` on every
  load (a client/server registration race in the devframe RPC migration,
  unrelated to any of the three ecosystem modules). None of those errors
  reproduce anymore.
- **Plan 00's deprecation diagnostics are live and already flagging real
  ecosystem usage** — exactly the signal this plan exists to surface:
  - `[NDT_DEP_0003] extendServerRpc is deprecated` fires from **both**
    `@nuxt/fonts` (`node_modules/@nuxt/fonts/dist/module.mjs`) and
    `nuxt-og-image`'s shared dependency `nuxtseo-shared`
    (`node_modules/nuxtseo-shared/dist/devtools.mjs`) — confirmed by
    grepping the installed packages for `extendServerRpc`. Both point to
    `onDevtoolsReady((ctx) => ctx.rpc.register(defineRpcFunction(...)))` as
    the fix — good candidates for the upstream questions in
    [Recommendations](#recommendations).
  - `[NDT_DEP_0004] startSubprocess is deprecated` fires too, but from this
    repo's **own** `local.ts` dev-tooling helper (used only by
    `NUXT_DEVTOOLS_LOCAL=true`, not by any ecosystem module) — worth a
    small follow-up to migrate `local.ts` itself to
    `ctx.terminals.startChildProcess(...)`, tracked separately from this
    plan.
  - `@nuxt/scripts`'s legacy `addCustomTab` (from its own
    `@nuxt/devtools-kit@^3.2.4` dependency, see the per-module finding below)
    did **not** trigger a matching deprecation warning in this run — either
    it's not yet covered by Plan 00's diagnostic catalog, or the code path it
    takes differs from `extendServerRpc`'s. Worth a follow-up once Plan 00's
    catalog is more complete.
- Everything else held: all three modules still show up in the Modules tab,
  all three tabs are still reachable (still only via the SideNav overflow
  menu), and `@nuxt/scripts` still shows "No scripts loaded".

## Summary

| Module | Version | Devtools surface? | Verdict |
|---|---|---|---|
| `nuxt-og-image` | 6.7.2 | Custom tab (`custom-nuxt-seo-og-image`) | Works — lazy-installs a companion panel |
| `@nuxt/scripts` | 1.3.1 | Custom tab (`custom-nuxt-scripts`) | Works |
| `@nuxt/fonts` | 0.14.0 | Custom tab (`custom-fonts`) | Works |

No console errors were caused by any of the three modules themselves. The only
console noise was pre-existing / environmental (see [Other observations](#other-observations)).

### A UX trap during verification, worth flagging on its own

None of the three modules' tabs are reachable from the SideNav's visible icon
strip. They only show up inside the **overflow "⋯" menu** at the bottom of the
SideNav — alongside other already-hidden built-ins (`debug`, `hooks`,
`server-discovery`, `virtual-files`, `custom-builtin-vscode`,
`custom-nuxt-seo-site-config`). A first-time user has no visual cue that
clicking "⋯" reveals more tabs; this is exactly the kind of discoverability
gap Plan 03 (dock groups / promote-tab-to-dock) is meant to fix. Recommend
cross-referencing this report when implementing Plan 03.

## Per-module findings

### `nuxt-og-image` 6.7.2 — works, lazy-installs its panel

- Installed module is detected (`nuxt-og-image`, ~102ms in the Modules tab).
- Registers a real custom tab, `custom-nuxt-seo-og-image`, reachable via the
  SideNav overflow menu.
- Opening it shows a **"Nuxt SEO DevTools"** placeholder: *"The panel needs
  `nuxtseo-layer-devtools` (dev only). Installing it adds the package to your
  devDependencies; nothing is changed until you choose to install."* with an
  **Install nuxtseo-layer-devtools** button. This is nuxt-og-image's own
  by-design lazy-install pattern (keeps the base module light) — not
  something to install as part of this opt-in dogfooding workspace, given the
  focus is verifying the Nuxt DevTools *entry point*, which works correctly.
- No console errors.
- Zero-config default OG image generation itself works fine (only a
  `WARN`-level notice in the terminal about the auto-generated signing secret,
  expected for a dev playground — see `NUXT_OG_IMAGE_SECRET` in its docs).

### `@nuxt/scripts` 1.3.1 — works

- Registers a real custom tab, `custom-nuxt-scripts`, reachable via the
  SideNav overflow menu. Renders its own full UI (Active Scripts / First-Party
  Mode / Registry / Docs sub-tabs).
- Uses the **legacy** `addCustomTab` API from its own `@nuxt/devtools-kit@^3.2.4`
  dependency (not the devframe-native APIs) — confirms the compatibility
  strategy works: an old-major `@nuxt/devtools-kit` consumer still works
  end-to-end against the in-development local devtools, because `addCustomTab`
  ultimately just calls `nuxt.hook('devtools:customTabs', ...)` against the
  single shared Nuxt instance — package-version skew in `@nuxt/devtools-kit`
  itself doesn't break it, as long as `@nuxt/kit`/`useNuxt()` stay deduped
  (they do here).
- The panel loaded with **"No scripts loaded"** even though `pages/index.vue`
  registers `js-confetti` via `useScriptNpm` with the default
  `trigger: 'onNuxtReady'` (so it should register on every page load). The
  panel also showed the same *"Not connected to the client app, showing
  server-side data only. Use the embedded mode for full features."* notice
  seen on the main Overview tab. Plausibly the same client-bridge gap, not a
  bug in `@nuxt/scripts` — flagged for a follow-up check once Plan 01/02's
  Messages/Terminals work lands and that bridge gets exercised more.
- Cosmetic-only: several `[Icon] failed to load icon 'carbon:script'` (and
  `carbon:security`, `carbon:catalog`, `carbon:book`, `carbon:reset`,
  `carbon:circle-dash`, `simple-icons:github`) console warnings inside the
  Scripts panel — icon fetches that didn't resolve in this sandbox. Does not
  block functionality.

### `@nuxt/fonts` 0.14.0 — works

- Registers a real custom tab, `custom-fonts`, reachable via the SideNav
  overflow menu.
- Opening it correctly lists **"1 fonts in total"**: the `Space Grotesk`
  font-family used in `assets/main.css` was auto-detected and self-hosted, and
  the panel renders a live "Aa" preview of it.
- No console errors.

## Modules removed after testing

Both of these were part of the playground during testing (see the git history
of this file/`modules/` for the full setup that was removed) and are kept here
purely as the evidence for dropping them — neither is installed in the
playground anymore.

### `@nuxt/content` 3.15.0 — no DevTools integration found

- Module loaded correctly (content was queried and rendered on the page fine;
  `55ms` load time in the Modules tab), but it registered **no** custom tab —
  confirmed by grepping the installed package for any DevTools hook:
  `grep -rl devtools node_modules/@nuxt/content/dist` returns nothing at all.
- This contradicts this plan's original assumption ("Content DevTools tab
  (collections/DB viewer)") — that integration either predates this major
  version or was removed. Nothing in the playground was broken; there was
  simply no surface to dogfood against, so it was removed rather than kept as
  dead weight.
- **Follow-up**: worth an upstream question/issue to `nuxt/content` asking
  whether a DevTools tab is planned/deprecated for v3, rather than assuming
  our local devtools regressed something.

### `@nuxt/image` 2.0.0 — no DevTools integration found

- Module loaded correctly (`<1ms` in the Modules tab, `<NuxtImg>` served/
  resized a sample image via `/_ipx/...` with no errors), but registered
  **no** custom tab — same `grep -rl devtools node_modules/@nuxt/image/dist`
  returns nothing.
- Same conclusion as `@nuxt/content`: this plan's assumption of an "Image
  module DevTools surface" doesn't hold for `@nuxt/image` 2.0.0. Removed for
  the same reason. Worth an upstream question/issue to `nuxt/image`.

## Other observations

- **Direct navigation to `/__nuxt_devtools__/client/` is not equivalent to the
  embedded dock.** Bypassing the floating dock and opening the client URL
  directly in a normal browser tab breaks the Vite DevTools RPC handshake
  (`[Nuxt DevTools] Unable to connect to Vite DevTools RPC — Failed to get
  connection meta from ./`), which makes the Modules tab falsely report
  **"Total modules: 0"**. This is expected (the client needs the parent-page
  RPC context that only exists when embedded), but it's an easy trap when
  dogfooding/debugging by hand — worth a one-line note in Nuxt DevTools' own
  troubleshooting docs.
- **The Vite DevTools authorization flow works as designed.** First load
  shows an "Unauthorized" badge; clicking it prompts for the 6-digit
  `devframe auth code` printed in the terminal (or a magic link). Entering it
  authorizes the session. This is unrelated to Nuxt or any of the three
  modules — it's Vite DevTools 0.4's own security gate — but it's worth
  documented in this repo's own contributor docs since it surprises anyone
  dogfooding for the first time (see the runbook in `README.md`).
- A few pre-existing Vue warnings appeared in the console, unrelated to any of
  the ecosystem modules: `onBeforeMount`/`onUnmounted is called when there is
  no active component instance...` (from a `SideNavItem`/`VTooltip` around the
  Terminals nav item) and a `[useAsyncData] Incompatible options detected for
  "npm:check:nuxt"` warning. Both come from the Nuxt DevTools **client** itself
  (not from this playground's app code), so out of scope for this plan — but
  worth a linked follow-up issue against `packages/devtools/client`. Still
  present after the Plan 00/RPC-fix rebase (Addendum 2).

## Recommendations

1. File upstream questions/issues against `nuxt/content` and `nuxt/image`
   asking about DevTools tab support (or lack thereof) in their current major
   versions, referencing this report.
2. File upstream issues against `nuxt-og-image`/`nuxtseo-shared` and
   `@nuxt/fonts` for their `extendServerRpc` usage now flagged by Plan 00's
   `NDT_DEP_0003` — both already have a clear migration path
   (`onDevtoolsReady((ctx) => ctx.rpc.register(defineRpcFunction(...)))`)
   printed right in the warning.
3. Once Plan 03 (dock groups / promote-tab-to-dock) lands, re-test whether
   `nuxt-og-image`, `@nuxt/scripts`, and `@nuxt/fonts`'s tabs are easier to
   discover than today's "buried in the overflow menu" state.
4. Confirmed (Addendum 2 above): `@nuxt/scripts`'s legacy
   `@nuxt/devtools-kit@^3.2.4` `addCustomTab` call keeps working against
   Plan 00's landed devframe-native hosts, per the `useNuxt()`-based
   mechanism described in its per-module finding above — but it did **not**
   trigger a deprecation diagnostic the way `extendServerRpc` did for the
   other two modules. Worth a follow-up once Plan 00's diagnostic catalog
   covers more of the legacy surface, to see whether `addCustomTab` itself
   should get its own `NDT_DEP_*` code.
5. Small, separate follow-up: `local.ts` (this repo's own
   `NUXT_DEVTOOLS_LOCAL` dev-tooling helper) triggers Plan 00's
   `NDT_DEP_0004` (`startSubprocess` deprecated) on every run — migrate it to
   `ctx.terminals.startChildProcess(...)` so dogfooding this playground
   doesn't itself produce deprecation noise.
6. Re-run after Plan 01 (Messages) lands to see whether `@nuxt/scripts`'s
   "No scripts loaded" / "Not connected to the client app" gap resolves once
   more of the client bridge is exercised.
