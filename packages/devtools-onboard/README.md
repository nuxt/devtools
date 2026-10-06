# @nuxt/devtools-onboard

The entry point of [Nuxt DevTools](https://devtools.nuxt.com). It is a tiny Nuxt module that Nuxt 5 ships instead of depending on `@nuxt/devtools` directly:

- when `@nuxt/devtools` is installed in your project, it loads it;
- when it is not, `nuxt dev` shows a floating button (built on [`@devframes/hub-ui-onboard`](https://devfra.me/guide/hub-ui-onboard)) that installs it with your package manager and restarts the dev server, so the real DevTools dock takes its place.

Nothing is injected outside `nuxt dev`.

## Turning it off

- `devtools: false` (or `devtools: { enabled: false }`) in `nuxt.config` disables both the button and DevTools.
- **Disable entirely** in the button's panel writes `node_modules/.devframe/hub-ui-onboard.json`; the button stays hidden on later starts until you delete that file or set the `devtools` option explicitly.
- **Hide for now** hides the button for the current tab only.

## Nuxt 4

Nuxt 4 depends on `@nuxt/devtools` itself, so this package is not needed there. Adding it to `modules` still works: it loads the installed DevTools and never shows the button.

```ts
export default defineNuxtConfig({
  modules: ['@nuxt/devtools-onboard'],
})
```
