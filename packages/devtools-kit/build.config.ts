import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/types',
    { input: 'src/runtime/', outDir: 'dist/runtime', format: 'esm' },
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
    'vite-plugin-vue-inspector',
  ],
  declaration: true,
  rollup: {
    emitCJS: true,
  },
})
