import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import NMarkdown from './NMarkdown.vue'

const meta = {
  title: 'UI Kit/Utilities/NMarkdown',
  component: NMarkdown,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Renders a markdown string. Uses DevTools client for rich rendering when available, otherwise falls back to plain text.',
      },
    },
  },
  argTypes: {
    markdown: { control: 'text', description: 'Markdown string to render' },
    tag: { control: 'text', description: 'Wrapper HTML tag (defaults to `span`)' },
  },
} satisfies Meta<typeof NMarkdown>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    markdown: 'This is **bold** and this is *italic* text.',
  },
}

export const WithCode: Story = {
  args: {
    markdown: 'Use `defineNuxtConfig()` to configure your Nuxt application.',
  },
}

export const AsDiv: Story = {
  args: {
    markdown: 'Block-level markdown content rendered in a **div** tag.',
    tag: 'div',
  },
}

export const LongContent: Story = {
  args: {
    markdown: `# Heading

This is a paragraph with **bold** and *italic* text.

- Item 1
- Item 2
- Item 3

\`\`\`js
const x = 1
\`\`\`
`,
    tag: 'div',
  },
}
