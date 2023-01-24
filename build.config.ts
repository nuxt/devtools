import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/types',
    'src/iframe-client',
  ],
  externals: [
    // Type only
    'vue',
    'vue-router',
  ],
})
