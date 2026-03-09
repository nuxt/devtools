import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import NBadgeHashed from './NBadgeHashed.vue'

const meta = {
  title: 'UI Kit/Data Display/NBadgeHashed',
  component: NBadgeHashed,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A badge that automatically generates a unique color based on string hash. Useful for distinguishing items visually.',
      },
    },
  },
  argTypes: {
    text: { control: 'text', description: 'Text to display and hash for color generation' },
  },
} satisfies Meta<typeof NBadgeHashed>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    text: 'nuxt',
  },
}

export const DifferentTexts: Story = {
  render: () => ({
    components: { NBadgeHashed },
    template: `
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <NBadgeHashed text="nuxt" />
        <NBadgeHashed text="vue" />
        <NBadgeHashed text="typescript" />
        <NBadgeHashed text="vite" />
        <NBadgeHashed text="unocss" />
        <NBadgeHashed text="pinia" />
      </div>
    `,
  }),
}

export const WithSlotContent: Story = {
  render: () => ({
    components: { NBadgeHashed },
    template: '<NBadgeHashed text="module"> v1.2.3</NBadgeHashed>',
  }),
}
