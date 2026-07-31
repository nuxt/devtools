// Per-major DevTools dogfooding playground — Nuxt 4 (stable).
//
// A SEALED pnpm workspace (own lockfile) that installs this repo's own
// `@nuxt/devtools` from a packed tarball — the real npm install path, from
// `dist`, no `workspace:`/`link:` aliases. Because everything installs into
// this workspace's single node_modules, the app and DevTools share one Vite /
// `@vitejs/devtools` instance, which `nuxi dev` needs. Run:
//   pnpm -C playgrounds-ecosystem/nuxt4 run setup     # build + pack + install
//   pnpm -C playgrounds-ecosystem/nuxt4 run play:dev  # dogfood DevTools
//   pnpm -C playgrounds-ecosystem/nuxt4 run play:build   # + run play:typecheck
//
// Nuxt 4 ships Nitro v2 (the `nitropack` package). See ../README.md.
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
