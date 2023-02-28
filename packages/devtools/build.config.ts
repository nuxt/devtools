import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/module',
    'src/cli',

    // Client side API
    'src/iframe-client',

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
