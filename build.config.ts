import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  externals: [
    // Type only
    'vue-router',
  ],
})
