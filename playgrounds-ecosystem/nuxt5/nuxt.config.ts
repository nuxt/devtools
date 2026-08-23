// Per-major DevTools dogfooding playground — Nuxt 5 (nightly).
//
// A SEALED pnpm workspace (own lockfile) that installs this repo's own
// `@nuxt/devtools` from a packed tarball — the real npm install path, from
// `dist`, no `workspace:`/`link:` aliases. Because everything installs into
// this workspace's single node_modules, the app and DevTools share one Vite /
// `@vitejs/devtools` instance, which `nuxi dev` needs. Run:
//   pnpm -C playgrounds-ecosystem/nuxt5 run setup     # build + pack + install
//   pnpm -C playgrounds-ecosystem/nuxt5 run play:dev  # dogfood DevTools
//   pnpm -C playgrounds-ecosystem/nuxt5 run play:build   # + run play:typecheck
//
// Nuxt 5 ships the next-gen Nitro v3 engine (`nitro`). See ../README.md.
export default defineNuxtConfig({
  modules: [
    '@nuxt/devtools',
  ],

  compatibilityDate: '2024-09-19',

  // A Nitro (v3) storage mount, so the config exercises Nitro-typed options.
  nitro: {
    storage: {
      playground: {
        driver: 'memory',
      },
    },
  },
})
