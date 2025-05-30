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
    'build:before': async (ctx) => {
      if (ctx.options.stub)
        return
      await buildCSS()
    },
    'rollup:options': function (ctx, options) {
      if (ctx.options.stub)
        return
      options.plugins.push(Vue())
    },
  },
})
