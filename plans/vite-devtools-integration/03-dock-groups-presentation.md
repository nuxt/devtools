# Plan 03 — "Nuxt" dock group + promote-tab-to-dock capability

**Status:** ready to execute · **Risk:** high (UX/architecture) ·
**Depends on:** the landed compat/deprecation foundation (nuxt/devtools#1021 —
see the folder README); benefits from plans 01 & 02 landing first (not a hard dep)
**Outcome:** Nuxt DevTools presents as a **"Nuxt" dock group** in the Vite
DevTools dock bar. The full client stays reachable as the group's hub member,
and a curated set of tools is **promoted** to sibling dock buttons under the
group. Promotion is a general, opt-in capability any tab can request.

> Self-contained: read this whole file; shared API facts are repeated here.
> This is the largest/most opinionated plan — do it after 01 & 02 if possible.

## Relationship to the landed foundation

The foundation shipped in nuxt/devtools#1021. Register the group + promoted
entries on `ctx.docks`:

- Nuxt DevTools' **own** group/hub registration lives in
  `packages/devtools/src/module-main.ts`'s `devtools.setup(ctx)` callback, right
  next to the existing `ctx.docks.register({ id: 'nuxt:devtools', … })` (which
  today registers a single iframe with `defaultOrder: -2000`).
- For **module authors** promoting their own tabs, use
  `onDevtoolsReady((ctx) => ctx.docks.register(...))` — the *already connected*
  context, so **no pre-connect queue** is needed. Raw escape hatch:
  `nuxt.devtools.devtoolsKit?.docks`.

**Tension to resolve, not ignore.** `addCustomTab` / `refreshCustomTabs` are now
**soft-deprecated** (`NDT_DEP_0005` / `NDT_DEP_0006`, shipped in #1021) pointing
authors at `ctx.docks.register`. `ctx.docks` is therefore the **long-term path**.
This plan still adds a `dock:true` **convenience flag** on the existing custom-tab
API (so authors get a dock button without rewriting onto docks yet), but treat it
as a bridge: the custom-tabs API persists mainly because docks does **not yet**
cover `vnode` views or tab categories. Do not present `dock:true` as the
permanent, recommended API — call out that `ctx.docks.register` is the direction
of travel. If you add any new deprecation here, use the **next free**
`NDT_DEP_xxxx` code (don't reuse `0002`).

## Context you need

Nuxt DevTools v4 renders inside **Vite DevTools** `@vitejs/devtools@0.4` on
**devframe 0.6**. Today it registers exactly **one** dock entry:

`packages/devtools/src/module-main.ts`, inside the plugin `devtools.setup(ctx)`
callback (`ctx` is a `ViteDevToolsNodeContext`):

```ts
ctx.docks.register({
  id: 'nuxt:devtools',
  type: 'iframe',
  icon: '/__nuxt_devtools__/client/nuxt.svg',
  title: 'Nuxt DevTools',
  url: '/__nuxt_devtools__/client/',
  defaultOrder: -2000,
})
```

That iframe loads the whole client, whose tabs live behind an internal
`SideNav`. Tab model:
- Built-in tabs = Nuxt pages under `packages/devtools/client/pages/modules/*.vue`,
  each declaring `definePageMeta({ icon, title, category?, order?, ... })`.
- Category logic: `packages/devtools/client/composables/state-tabs.ts`
  (`getCategorizedTabs` / `getCategorizedRecord`); default category `'app'`.
- Custom tabs (module- and user-contributed): server side
  `packages/devtools/src/server-rpc/custom-tabs.ts` (`setupCustomTabRPC`, seeded
  from `options.customTabs`, extended via the `devtools:customTabs` Nuxt hook,
  refreshed via `devtools:customTabs:refresh`); client side
  `useCustomTabs()` (`client/composables/state.ts`), merged in `state-tabs.ts`.
  A custom tab may be an **iframe** view (its own `src`) or an in-client view.

### devframe dock/group API (target)

`ctx.docks.register(entry, force?)` on the `ViteDevToolsNodeContext`:

- A **group** is a first-class dock entry: `{ id, type: 'group', title, icon,
  defaultOrder?, category?, defaultChildId? }`. `defaultChildId` = the member
  auto-opened when the group button is activated.
- A **member** joins by setting `groupId: '<group id>'` on its own entry (any
  entry type). Grouping is a flat pointer, **one level deep**, orphan-tolerant.
- `category` (`'app'|'framework'|'web'|'advanced'|'default'|'~builtin'|(string&{})`)
  is a **separate** ordering axis, not the grouping mechanism.
- Entry types: `iframe` (`{ url, frameId?, clientScript?, remote? }`), `action`,
  `custom-render`, `launcher`, `json-render`, `group`.
- Precedent to copy exactly: Vite DevTools core registers the `~viteplus`
  ("Vite+") group and Rolldown joins it with `groupId: DEVTOOLS_VITEPLUS_GROUP_ID`
  (constant exported from `@vitejs/devtools-kit/constants`). Find these in
  `node_modules/.pnpm/@vitejs+devtools@0.4.0*/…/dist` (`server-*.js` registers the
  group; the rolldown package's `index.mjs` joins it).

### Hard constraint — the Vue DevTools bridge

Only **one** iframe can hold the Vue DevTools messaging context at a time
(`setIframeServerContext(iframe)` is a single global; see
`packages/devtools/src/runtime/plugins/view/client.ts` — the `bindVueDevToolsIframe`
logic that fixed the "Connecting…" bug binds exactly one dock iframe). Therefore
the Vue-backed tools **Pinia** and **Render Tree** must stay inside the single
hub iframe and must **not** be promoted to their own iframe entries.

## Decisions (locked)

1. **Curated hybrid "Nuxt" group.** Register a `type:'group'` entry `id:'nuxt'`,
   title "Nuxt". The existing `nuxt:devtools` iframe becomes its hub member
   (`groupId:'nuxt'`, and the group's `defaultChildId:'nuxt:devtools'`).
2. **General opt-in promotion.** Any tab — core page, module custom tab, or user
   custom tab — can request a dock button under the group via a flag
   (e.g. `dock: true` in `definePageMeta` meta and in the custom-tab options
   type). Ship a curated default set enabled.
3. **Type-aware realization** of a promoted tab into a dock entry:
   - If the tab is an **iframe** custom tab → register a dock `iframe` entry
     pointing at the tab's own `src` (`groupId:'nuxt'`). Zero Nuxt-client cost.
   - Otherwise (core page / in-client custom tab) → register a dock `iframe`
     entry whose `url` deep-links into the Nuxt client in a new **shell-less
     "dock" mode** (SideNav hidden), e.g. `/__nuxt_devtools__/client/modules/components?dock=1`.
     One Nuxt-client instance per promoted tool (lazily created by iframe-pane on
     first open).
4. **Relocating** SideNav semantics: a promoted tool **leaves** the hub SideNav;
   it lives only as a dock button. The hub SideNav shrinks to the non-promoted
   tools + the Vue-bridge tools (Pinia, Render Tree) that can't be promoted.
5. **Default promoted set: Components, Server Routes, Pages.** (All RPC-driven,
   none depend on the Vue bridge, so safe as separate instances.)

## Implementation

### Step 1 — register the "Nuxt" group + hub membership

In `module-main.ts`'s `devtools.setup(ctx)`, before/around the existing
`ctx.docks.register({ id:'nuxt:devtools', … })`:

```ts
ctx.docks.register({
  id: 'nuxt',
  type: 'group',
  title: 'Nuxt',
  icon: '/__nuxt_devtools__/client/nuxt.svg',
  defaultOrder: -900,          // sits near the framework tools; tune vs ~viteplus (-1000)
  defaultChildId: 'nuxt:devtools',
})
ctx.docks.register({
  id: 'nuxt:devtools',
  type: 'iframe',
  icon: '/__nuxt_devtools__/client/nuxt.svg',
  title: 'Nuxt DevTools',
  url: '/__nuxt_devtools__/client/',
  groupId: 'nuxt',
})
```

### Step 2 — a shell-less "dock" render mode in the client

- Add a mode (query param `?dock=1` or a dedicated route prefix) that the client
  reads to render a single tool **without the SideNav/shell**. In
  `packages/devtools/client/app.vue` the shell already distinguishes
  `isUtilityView` (hides `SideNav` for `/__`/`/` routes) — extend that to a
  "dock" mode: when set, hide `SideNav` and render only `<NuxtPage>` (the target
  tool). Pinia/render-tree already use `layout:'full'`; reuse that pattern.
- A promoted in-client tool's dock entry URL =
  `/__nuxt_devtools__/client{route}?dock=1` (e.g. `/modules/components?dock=1`).
- Each such iframe is its own client instance; it connects to the host client
  via the existing `connectParent()` path
  (`packages/devtools/client/plugins/global.ts` reads
  `window.parent.__NUXT_DEVTOOLS_HOST__`), so host metrics/hooks still work.
  **Do not** rely on the Vue DevTools bridge in these (that's hub-only).

### Step 3 — the promotion capability (server + registration)

- Extend the tab meta contract with an opt-in `dock` flag:
  - Core pages: read `dock` from `definePageMeta` (surface it through the tab
    collection in `state-tabs.ts` / the client tab type).
  - Custom tabs: add `dock?: boolean` to the custom-tab options type (the
    `devtools:customTabs` contributions and `options.customTabs`), threaded
    through `server-rpc/custom-tabs.ts` (`getCustomTabs`).
- Server side, in `module-main.ts`/`server-rpc`, collect the set of tabs with
  `dock: true` and register a dock `iframe` entry per tab under `groupId:'nuxt'`,
  choosing the URL per the **type-aware** rule in Decision 3:
  - iframe custom tab → its own `src`.
  - everything else → `/__nuxt_devtools__/client{route}?dock=1`.
  - Use the tab's `icon`/`title` for the dock entry; derive a stable dock id
    (e.g. `nuxt:tab:<name>`).
  - Custom tabs arrive/refresh dynamically (`devtools:customTabs:refresh`) — keep
    the promoted dock entries in sync (register on add, update on change; use the
    `ctx.docks.register(...)` return `{ update }` handle, and re-evaluate on
    refresh). Do this from `onDevtoolsReady((ctx) => …)` so `ctx.docks` is
    already connected; buffer tabs collected before `ready` and register them in
    the callback (no `pendingBroadcasts`-style queue needed).
- Ship the curated default: mark **Components, Server Routes, Pages** with
  `dock: true` in their `definePageMeta`.

### Step 4 — relocating SideNav

- In `state-tabs.ts` (the SideNav's tab source), **exclude** tabs that are
  promoted-to-dock so they no longer appear in the hub SideNav. Keep Vue-bridge
  tools (Pinia, Render Tree) and all non-promoted tools in the SideNav.
- Make sure the promoted tool is still reachable programmatically (e.g. the
  command palette / deep links) even though it's not in the SideNav.
- Consider what the hub shows by default (Overview) now that Components/Server
  Routes/Pages are gone from its SideNav.

### Step 5 — docs & extensibility surface

- Document the `dock: true` flag for module authors (custom tab option) so the
  ecosystem (Content, i18n, …) can surface a Nuxt-group dock button.
- Ensure orphan tolerance: if a module marks `dock:true` but the group somehow
  isn't registered, the entry still renders top-level (devframe handles this).

## Acceptance criteria

- The dock bar shows a **"Nuxt"** group button; expanding it lists the hub
  ("Nuxt DevTools") plus **Components**, **Server Routes**, **Pages** as members.
- Opening a promoted tool shows just that tool (no SideNav), in its own iframe,
  fully functional (RPC works; host metrics available).
- Those three tools **no longer appear** in the hub SideNav; Pinia + Render Tree
  still do and still connect (Vue bridge intact — no "Connecting…" regression).
- A playground module contributing a custom tab with `dock: true` gets its own
  dock button under the Nuxt group (iframe tab → its own src; in-client tab →
  `?dock=1`).
- `pnpm lint && pnpm build && pnpm typecheck` and the e2e suite
  (`pnpm test:e2e`) pass; extend/adjust the dock/iframe e2e fixtures
  (`tests/e2e/`) for the group + promoted entries.

## Risks / gotchas

- **Per-entry iframe cost.** Each promoted in-client tool is a full, separate
  Nuxt DevTools client instance (lazy, then kept alive by iframe-pane). Keep the
  default promoted set small; that's why it's curated (3 tools).
- **Vue bridge is single-context.** Never promote Pinia/Render Tree as their own
  iframe; they must stay in the hub. Guard against a module marking a Vue-bridge
  tool `dock:true`.
- **Bridge binding targets the hub.** `bindVueDevToolsIframe` in
  `view/client.ts` binds one dock iframe. With multiple Nuxt iframes now present
  (hub + promoted), ensure it binds the **hub** iframe (id `nuxt:devtools`), not
  a promoted one. Review/adjust that logic (it currently binds by dock entry id
  `nuxt:devtools`, which is correct — verify it still resolves to the hub).
- **Dynamic custom tabs.** Promoted dock entries must track the async
  `devtools:customTabs` lifecycle (add/update/remove + refresh); register them
  from `onDevtoolsReady` and buffer any collected before the hook fires.
- **"Relocating" UX surprise.** Tools vanish from the SideNav; make sure they're
  discoverable via the dock group and the command palette. Consider a one-time
  note/changelog for users.
- **e2e fixtures.** `tests/e2e/fixtures/devtools.ts` currently drives the single
  `nuxt:devtools` dock entry; add coverage for the group + a promoted entry.
