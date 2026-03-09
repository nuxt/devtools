import type { StorybookConfig } from '@storybook-vue/nuxt'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))

const config = {
  stories: [
    '../src/components/**/*.mdx',
    '../src/components/**/*.stories.@(js|jsx|ts|tsx|mdx)',
  ],

  addons: [
    ('@chromatic-com/storybook'),
    ('@storybook/addon-docs'),
    ('@storybook/addon-a11y'),
    ('@storybook/addon-vitest'),
  ],
  framework: '@storybook-vue/nuxt',
} satisfies StorybookConfig

export default config
