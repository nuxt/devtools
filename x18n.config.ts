import { defineConfig } from '@x18n/cli'

// Translations of the Nuxt DevTools client UI. The languages mirror the ones
// the Devframe hub UI ships (`DEVTOOLS_LOCALES` in
// `packages/devtools/client/i18n/locales.ts`). Run `pnpm i18n:check`.
export default defineConfig({
  sourceLocale: 'en',
  presets: ['vue-i18n'],
  resources: [
    { pattern: 'packages/devtools/client/locales/{locale}.json' },
  ],
  usage: {
    include: ['packages/devtools/client/**/*.{ts,vue}'],
  },
})
