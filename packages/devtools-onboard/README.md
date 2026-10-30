# @nuxt/devtools-onboard

The entry point of [Nuxt DevTools](https://nuxt.com/modules/devtools). It is a tiny Nuxt module that Nuxt 5 ships instead of depending on `@nuxt/devtools` directly:

- when Nuxt DevTools is installed in your project, it loads it: `@nuxt/devtools` v3 or v4, or a [nightly release](https://nuxt.com/modules/devtools#nightly-release-channel) aliased as `@nuxt/devtools` or installed as `@nuxt/devtools-nightly` (which wins when both are present);
- when it is not, `nuxt dev` shows a floating button (built on [`@devframes/hub-ui-onboard`](https://devfra.me/guide/hub-ui-onboard)) that installs it with your package manager and restarts the dev server, so the real DevTools dock takes its place.

Nothing is injected outside `nuxt dev`.

The dev server can be reachable from other devices, so each install from the button waits for you in the terminal that runs `nuxt dev`. In nuxi's interactive view, press `y`; in plain mode, type `yes` and press Enter. Anything else refuses, and so does no answer within 5 minutes. When the terminal cannot answer, for example after the dev server restarted under the interactive view, the install is refused and the panel shows the command to run yourself.

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
