import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/types',
  ],
  externals: [
    // Type only
    'vue-router',
  ],
})
