import { fileURLToPath } from 'node:url'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
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
  hooks: {
    // Patch @nuxt/module-builder@0.6.0 not adding .mjs extension for runtime files
    // https://github.com/nuxt/module-builder/issues/261
    'rollup:options': (_, options) => {
      options.plugins ||= []
      if (!Array.isArray(options.plugins))
        options.plugins = [options.plugins]

      const runtimeDir = fileURLToPath(new URL('./src/runtime', import.meta.url))
      options.plugins.unshift({
        name: 'unbuild:runtime-build:patch',
        async resolveId(id, importter) {
          if (!id.includes('runtime'))
            return
          const resolved = await this.resolve(id, importter, { skipSelf: true })
          if (resolved?.id.startsWith(runtimeDir)) {
            let id = resolved.id
            if (!id.endsWith('.mjs'))
              id += '.mjs'
            return {
              external: true,
              id,
            }
          }
        },
      })
    },
  },
})
