import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import NCodeBlock from './NCodeBlock.vue'

const meta = {
  title: 'UI Kit/Utilities/NCodeBlock',
  component: NCodeBlock,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A code block component with optional syntax highlighting (requires DevTools client for Shiki). Falls back to plain text rendering. Supports line numbers.',
      },
    },
  },
  argTypes: {
    code: { control: 'text', description: 'Code string to display' },
    lang: { control: 'text', description: 'Language for syntax highlighting (e.g. typescript, vue, json)' },
    lines: { control: 'boolean', description: 'Show line numbers' },
    inline: { control: 'boolean', description: 'Render inline (no line numbers)' },
  },
} satisfies Meta<typeof NCodeBlock>

export default meta
type Story = StoryObj<typeof meta>

export const PlainText: Story = {
  args: {
    code: `export default defineNuxtConfig({
  modules: ['@nuxt/devtools'],
  devtools: { enabled: true },
})`,
    lang: 'text',
  },
}

export const WithLineNumbers: Story = {
  args: {
    code: `import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}`,
    lang: 'text',
    lines: true,
  },
}

export const NoLineNumbers: Story = {
  args: {
    code: 'const hello = "world"',
    lang: 'text',
    lines: false,
  },
}

export const MultilineJSON: Story = {
  args: {
    code: JSON.stringify({ name: 'nuxt', version: '3.0.0', dependencies: { vue: '^3.3.0' } }, null, 2),
    lang: 'text',
    lines: true,
  },
}
