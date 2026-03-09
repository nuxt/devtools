import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import NLink from './NLink.vue'

const meta = {
  title: 'UI Kit/Utilities/NLink',
  component: NLink,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A link component wrapping NuxtLink. Supports `to`/`href`, external link indicator, and underline styling.',
      },
    },
  },
  argTypes: {
    to: { control: 'text', description: 'Internal route path' },
    href: { control: 'text', description: 'External URL' },
    target: { control: 'text', description: 'Link target (e.g. _blank)' },
    underline: { control: 'boolean', description: 'Show underline styling without a link' },
  },
} satisfies Meta<typeof NLink>

export default meta
type Story = StoryObj<typeof meta>

export const InternalLink: Story = {
  args: {
    to: '/dashboard',
  },
  render: args => ({
    components: { NLink },
    setup() {
      return { args }
    },
    template: '<NLink v-bind="args">Go to Dashboard</NLink>',
  }),
}

export const ExternalLink: Story = {
  args: {
    href: 'https://nuxt.com',
    target: '_blank',
  },
  render: args => ({
    components: { NLink },
    setup() {
      return { args }
    },
    template: '<NLink v-bind="args">Nuxt.com</NLink>',
  }),
}

export const UnderlineOnly: Story = {
  args: {
    underline: true,
  },
  render: args => ({
    components: { NLink },
    setup() {
      return { args }
    },
    template: '<NLink v-bind="args">Styled text without link</NLink>',
  }),
}

export const PlainText: Story = {
  render: () => ({
    components: { NLink },
    template: '<NLink>No link, just slot content</NLink>',
  }),
}
