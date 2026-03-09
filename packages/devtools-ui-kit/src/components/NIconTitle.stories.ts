import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import NIconTitle from './NIconTitle.vue'

const meta = {
  title: 'UI Kit/Data Display/NIconTitle',
  component: NIconTitle,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Displays an icon alongside a text title. Commonly used for section headers.',
      },
    },
  },
  argTypes: {
    icon: { control: 'text', description: 'UnoCSS icon class' },
    text: { control: 'text', description: 'Title text' },
  },
} satisfies Meta<typeof NIconTitle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: 'i-carbon-settings',
    text: 'Settings',
  },
}

export const IconOnly: Story = {
  args: {
    icon: 'i-carbon-warning',
  },
}

export const TextOnly: Story = {
  args: {
    text: 'No Icon Title',
  },
}

export const WithSlot: Story = {
  render: () => ({
    components: { NIconTitle },
    template: `
      <NIconTitle icon="i-carbon-dashboard">
        <div>
          <div>Custom Content</div>
          <div style="font-size: 0.8em; opacity: 0.6;">Subtitle text</div>
        </div>
      </NIconTitle>
    `,
  }),
}
