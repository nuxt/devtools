import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/types',
    'src/runtime/iframe-client',
    'src/runtime/host-client',
  ],
  externals: [
    '@nuxt/kit',

    // type only
    'nuxt',
    'nuxt/schema',
    '@nuxt/schema',
    'nitropack',
    'nitro',
    'nitro/types',
    'unimport',
    'unstorage',
    'ofetch',
    'vue',
    'vue-router',
    'nuxt/dist/app/nuxt',
    'birpc',
    'hookable',
    'error-stack-parser-es',
    'shiki',
    '@vitejs/devtools-kit',
  ],
  declaration: 'node16',
})
