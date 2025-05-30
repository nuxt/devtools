import { defineBuildConfig } from 'unbuild'
import Vue from 'unplugin-vue/rollup'
import { buildCSS } from './src/webcomponents/scripts/build-css'

export default defineBuildConfig({
  entries: [
    'src/module',
    // Chunking
    'src/types',
    'src/dirs',
    'src/webcomponents/index',
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
  declaration: 'node16',
  clean: false,
  hooks: {
    'build:before': async () => {
      await buildCSS()
    },
    'rollup:options': function (ctx, options) {
      options.plugins.push(Vue())
    },
  },
})
