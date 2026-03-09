import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import NCard from './NCard.vue'

const meta = {
  title: 'UI Kit/Layout/NCard',
  component: NCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A simple card container with base styling.',
      },
    },
  },
} satisfies Meta<typeof NCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { NCard },
    template: '<NCard><div style="padding: 16px;">Card content goes here</div></NCard>',
  }),
}

export const WithRichContent: Story = {
  render: () => ({
    components: { NCard },
    template: `
      <NCard>
        <div style="padding: 16px;">
          <h3 style="margin: 0 0 8px;">Card Title</h3>
          <p style="margin: 0; opacity: 0.7;">Some description text inside the card component.</p>
        </div>
      </NCard>
    `,
  }),
}

export const MultipleCards: Story = {
  render: () => ({
    components: { NCard },
    template: `
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
        <NCard><div style="padding: 16px;">Card 1</div></NCard>
        <NCard><div style="padding: 16px;">Card 2</div></NCard>
        <NCard><div style="padding: 16px;">Card 3</div></NCard>
      </div>
    `,
  }),
}
