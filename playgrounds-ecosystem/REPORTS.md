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

## Summary

| Module | Version | Devtools surface? | Verdict |
|---|---|---|---|
| `nuxt-og-image` | 6.7.2 | Custom tab (`custom-nuxt-seo-og-image`) | Works — lazy-installs a companion panel |
| `@nuxt/scripts` | 1.3.1 | Custom tab (`custom-nuxt-scripts`) | Works |
| `@nuxt/fonts` | 0.14.0 | Custom tab (`custom-fonts`) | Works |
| `@nuxt/content` | 3.15.0 | **None found** | No DevTools integration in this major |
| `@nuxt/image` | 2.0.0 | **None found** | No DevTools integration in this major |

No console errors were caused by any of the five modules themselves. The only
console noise was pre-existing / environmental (see [Other observations](#other-observations)).

### A UX trap during verification, worth flagging on its own

None of the five modules' tabs are reachable from the SideNav's visible icon
strip. They only show up inside the **overflow "⋯" menu** at the bottom of the
SideNav — alongside other already-hidden built-ins (`debug`, `hooks`,
`server-discovery`, `virtual-files`, `custom-builtin-vscode`,
`custom-nuxt-seo-site-config`). A first-time user has no visual cue that
clicking "⋯" reveals five more tabs; this is exactly the kind of
discoverability gap Plan 03 (dock groups / promote-tab-to-dock) is meant to
fix. Recommend cross-referencing this report when implementing Plan 03.

## Per-module findings

### `nuxt-og-image` 6.7.2 — works, lazy-installs its panel

- Installed module is detected (`8 modules` → `nuxt-og-image`, ~102ms in the
  Modules tab).
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
  dependency (not the devframe-native APIs Plan 00 introduces) — confirms the
  shim-first strategy in `plans/vite-devtools-integration/README.md` is the
  right approach: an old-major `@nuxt/devtools-kit` consumer still works
  end-to-end against the in-development local devtools, because `addCustomTab`
  ultimately just calls `nuxt.hook('devtools:customTabs', ...)` against the
  single shared Nuxt instance — package-version skew in `@nuxt/devtools-kit`
  itself doesn't break it, as long as `@nuxt/kit`/`useNuxt()` stay deduped
  (they do here; verify this holds once Plan 00's shims land).
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

### `@nuxt/content` 3.15.0 — no DevTools integration found

- Module loads correctly (content is queried and rendered on the page fine;
  `55ms` load time in the Modules tab), but it registers **no** custom tab —
  confirmed by grepping the installed package for any DevTools hook:
  `grep -rl devtools node_modules/@nuxt/content/dist` returns nothing at all.
- This contradicts this plan's original assumption ("Content DevTools tab
  (collections/DB viewer)") — that integration either predates this major
  version or was removed. Nothing in this playground is broken; there's
  simply no surface to dogfood against.
- **Follow-up**: worth an upstream question/issue to `nuxt/content` asking
  whether a DevTools tab is planned/deprecated for v3, rather than assuming
  our local devtools regressed something.

### `@nuxt/image` 2.0.0 — no DevTools integration found

- Module loads correctly (`<1ms` in the Modules tab, `<NuxtImg>` serves/
  resizes `public/sample.png` via `/_ipx/...` with no errors), but registers
  **no** custom tab — same `grep -rl devtools node_modules/@nuxt/image/dist`
  returns nothing.
- Same conclusion as `@nuxt/content`: this plan's assumption of an "Image
  module DevTools surface" doesn't hold for `@nuxt/image` 2.0.0. Worth an
  upstream question/issue to `nuxt/image`.

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
  authorizes the session. This is unrelated to Nuxt or any of the five
  modules — it's Vite DevTools 0.4's own security gate — but it's worth
  documented in this repo's own contributor docs since it surprises anyone
  dogfooding for the first time (see the runbook in `README.md`).
- Two pre-existing Vue warnings appeared in the console, unrelated to any of
  the five ecosystem modules: `onUnmounted is called when there is no active
  component instance...` (from a `SideNavItem`/`VTooltip` around the
  Terminals nav item) and a `[useAsyncData] Incompatible options detected for
  "npm:check:nuxt"` warning. Both come from the Nuxt DevTools **client** itself
  (not from this playground's app code), so out of scope for this plan — but
  worth a linked follow-up issue against `packages/devtools/client`.

## Recommendations

1. File upstream questions/issues against `nuxt/content` and `nuxt/image`
   asking about DevTools tab support (or lack thereof) in their current major
   versions, referencing this report.
2. Once Plan 03 (dock groups / promote-tab-to-dock) lands, re-test whether
   `nuxt-og-image`, `@nuxt/scripts`, and `@nuxt/fonts`'s tabs are easier to
   discover than today's "buried in the overflow menu" state.
3. Re-run this playground once Plan 00's devframe-native hosts + shim layer
   land, to confirm `@nuxt/scripts`'s legacy `@nuxt/devtools-kit@^3.2.4`
   `addCustomTab` call keeps working unshimmed (it should, per the
   `useNuxt()`-based mechanism described above) and pick up the new
   deprecation diagnostics if any fire for it.
4. Re-run after Plan 01 (Messages) lands to see whether `@nuxt/scripts`'s
   "No scripts loaded" / "Not connected to the client app" gap resolves once
   more of the client bridge is exercised.
