import antfu from '@antfu/eslint-config'

export default await antfu(
  {
    formatters: true,
    unocss: true,
    ingores: [
      'clones',
      'docs',
      '**/*.sh',
    ],
  },
  {
    rules: {
      'node/prefer-global/process': 'off',
      'vue/no-v-text-v-html-on-component': 'off',
    },
  },
)
