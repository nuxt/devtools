import antfu from '@antfu/eslint-config'
import { extend } from 'eslint-flat-config-utils'

export default antfu(
  {
    formatters: true,
    unocss: true,
    pnpm: true,
    ignores: [
      '**/.generated/**',
      '**/plans/**/*.md',
      // Its own sealed pnpm workspace (see
      // playgrounds-ecosystem/modules/pnpm-workspace.yaml), opt-in and out of
      // the main lint/typecheck/test surface — see
      // plans/vite-devtools-integration/04-ecosystem-playgrounds.md
      '**/playgrounds-ecosystem/**',
    ],
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
