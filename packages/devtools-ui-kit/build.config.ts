import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  entries: [
    { input: 'src/module', format: 'esm' },
    { input: 'src/unocss', format: 'esm' },
    { input: 'src/components/', outDir: 'dist/components' },
    { input: 'src/assets/', outDir: 'dist/assets' },
  ],
  externals: [
    '@nuxt/schema',
    'nuxt/schema',
    'unocss.mjs',
  ],
})
