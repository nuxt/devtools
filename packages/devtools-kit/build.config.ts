import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/types',
    'src/iframe-client',
  ],
  externals: [
    '@nuxt/kit',

    // type only
    'nuxt',
    'nuxt/schema',
    '@nuxt/schema',
    'nitropack',
    'unimport',
    'unstorage',
    'vue',
    'vue-router',
    'nuxt/dist/app/nuxt',
    'birpc',
    'hookable',
  ],
  declaration: true,
  rollup: {
    emitCJS: true,
  },
})
