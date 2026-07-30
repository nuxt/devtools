// Per-major DevTools dogfooding playground — Nuxt 4 (stable).
//
// A member of the ROOT pnpm workspace (see the repo `pnpm-workspace.yaml`), so
// `@nuxt/devtools` resolves to this repo's own build (via the root
// `overrides: '@nuxt/devtools': workspace:*`) sharing the single root
// node_modules — the app and DevTools use one Vite / `@vitejs/devtools`
// instance, which `nuxi dev` needs. (Sealing it in its own workspace + a
// `link:` made the app's dev SSR transform DevTools' whole dep tree twice and
// OOM the render worker.)
//
// Nuxt 4 ships Nitro v2 (the `nitropack` package). Run:
//   pnpm -C playgrounds-ecosystem/nuxt4 run play:dev   # dogfood DevTools
//   pnpm -C playgrounds-ecosystem/nuxt4 run play:build # + run play:typecheck
export default defineNuxtConfig({
  modules: [
    '@nuxt/devtools',
  ],

  compatibilityDate: '2024-09-19',

  future: {
    compatibilityVersion: 4,
  },

  // A Nitro (v2) storage mount, so the config exercises Nitro-typed options.
  nitro: {
    storage: {
      playground: {
        driver: 'memory',
      },
    },
  },
})
