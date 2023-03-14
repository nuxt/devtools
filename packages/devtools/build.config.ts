import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/module',
    'src/cli',

    // Chunking
    'src/types',
    'src/dirs',
  ],
  externals: [
    'nuxt',
    'nuxt/schema',
    'vite',
    '@nuxt/kit',
    '@nuxt/schema',
    // Type only
    'vue',
    'vue-router',
    'unstorage',
    'nitropack',
  ],
  rollup: {
    inlineDependencies: true,
  },
})
