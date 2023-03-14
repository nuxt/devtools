import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  externals: [
    'nuxt',
    'nuxt/schema',
    'vite',
    'vue',
    '@nuxt/kit',
    '@nuxt/schema',
  ],
})
