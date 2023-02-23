import { extendUnocssOptions } from './src/unocss'

// for IDE support
export default {
  ...extendUnocssOptions(),
  configDeps: [
    './src/unocss/index.ts',
  ],
}
