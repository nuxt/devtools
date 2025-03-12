import antfu from '@antfu/eslint-config'
import { extend } from 'eslint-flat-config-utils'

export default antfu(
  {
    formatters: true,
    unocss: true,
    pnpm: true,
  },
  {
    rules: {
      'node/prefer-global/process': 'off',
      'vue/no-v-text-v-html-on-component': 'off',
    },
  },
)
  .append(
    extend(
      import('./packages/devtools/client/.nuxt/eslint.config.mjs').then(mod => mod.default()),
      'packages/devtools/client',
    ),
  )
  .removeRules(
    'vue/no-multiple-template-root',
  )
