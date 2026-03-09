import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import NPanelGrids from './NPanelGrids.vue'

const meta = {
  title: 'UI Kit/Layout/NPanelGrids',
  component: NPanelGrids,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A centered panel grid container, typically used to center content within a panel.',
      },
    },
  },
} satisfies Meta<typeof NPanelGrids>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { NPanelGrids },
    template: `
      <div style="height: 200px;">
        <NPanelGrids>
          <div>Centered content</div>
        </NPanelGrids>
      </div>
    `,
  }),
}

export const WithMultipleItems: Story = {
  render: () => ({
    components: { NPanelGrids },
    template: `
      <div style="height: 300px;">
        <NPanelGrids>
          <div style="text-align: center;">
            <div style="font-size: 48px;">📦</div>
            <div>No items found</div>
            <div style="opacity: 0.6; font-size: 0.875rem;">Try adjusting your filters</div>
          </div>
        </NPanelGrids>
      </div>
    `,
  }),
}
