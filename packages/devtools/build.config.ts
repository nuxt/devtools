import { defineBuildConfig } from 'unbuild'
import Vue from 'unplugin-vue/rollup'
import { buildCSS } from './webcomponents/scripts/build-css'

export default defineBuildConfig([
  {
    entries: [
      'src/module',
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
  },
  {
    entries: [
      'webcomponents/index',
    ],
    externals: [
      'vue',
    ],
    rollup: {
      inlineDependencies: true,
    },
    hooks: {
      'build:before': async () => {
        await buildCSS()
      },
      'rollup:options': function (ctx, options) {
        options.plugins.push(Vue())
      },
    },
  },
])
