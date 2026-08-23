import { writeFile } from 'node:fs/promises'
import { defineBuildConfig } from 'unbuild'
import Vue from 'unplugin-vue/rollup'
import { buildCSS } from './src/webcomponents/scripts/build-css'

const WEB_COMPONENTS_STUB = new URL('./dist/webcomponents/index.mjs', import.meta.url)

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
    '@nuxt/devtools',
    '@nuxt/devtools/webcomponents',
    // Type only
    'vue',
    'vue-router',
    'unstorage',
    'nitropack',
    'vite-plugin-vue-tracer',
  ],
  rollup: {
    inlineDependencies: true,
  },
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
    'build:done': async (ctx) => {
      if (!ctx.options.stub)
        return

      // unbuild's default stub loads TypeScript through jiti. This entry is
      // imported by the browser-side inspector plugin, where that Node-only
      // loader cannot run. Vite can transform the source entry directly while
      // developing this workspace; published builds still receive the bundled
      // web component above.
      await writeFile(WEB_COMPONENTS_STUB, `export * from '../../src/webcomponents/index.ts'\n`)
    },
  },
})
