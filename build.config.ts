import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/types',
    'src/module',
    'src/dirs',
    'src/iframe-client',
    'src/cli',
  ],
  externals: [
    // Type only
    'vue',
    'vue-router',
  ],
})
