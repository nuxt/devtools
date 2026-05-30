// https://nuxt.com/docs/api/configuration/nuxt-config
const devtoolsModule = process.env.NUXT_DEVTOOLS_LOCAL ? '../../local' : '@nuxt/devtools'

// Regression playground for the dock-missing bug. With `ssr: false` AND
// `experimental.viteEnvironmentApi: true`, `@nuxt/kit`'s `addVitePlugin`
// takes the `applyToEnvironment` wrapper branch (`config.environments` is
// always populated). The wrapper plugin object lacks a `devtools` property,
// so `@vitejs/devtools`'s `"devtools" in plugin` filter silently drops it
// and the Nuxt DevTools dock entry never registers. This mirrors the Nuxt 5
// vite-builder code path the bug was originally reported against.
export default defineNuxtConfig({
  modules: [
    devtoolsModule,
  ],

  ssr: false,

  experimental: {
    viteEnvironmentApi: true,
  },

  compatibilityDate: '2024-09-19',
})
