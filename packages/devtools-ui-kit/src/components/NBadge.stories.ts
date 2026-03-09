import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import NBadge from './NBadge.vue'

const meta = {
  title: 'UI Kit/Data Display/NBadge',
  component: NBadge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A simple badge component for displaying short labels or status indicators.',
      },
    },
  },
} satisfies Meta<typeof NBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { NBadge },
    setup() {
      return { args }
    },
    template: '<NBadge v-bind="args">Badge</NBadge>',
  }),
}

export const WithText: Story = {
  render: () => ({
    components: { NBadge },
    template: '<NBadge>New</NBadge>',
  }),
}

export const MultipleBadges: Story = {
  render: () => ({
    components: { NBadge },
    template: `
      <div style="display: flex; gap: 8px;">
        <NBadge>Info</NBadge>
        <NBadge>Warning</NBadge>
        <NBadge>Success</NBadge>
      </div>
    `,
  }),
}
