import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import NIcon from './NIcon.vue'

const meta = {
  title: 'UI Kit/Data Display/NIcon',
  component: NIcon,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Renders an icon using UnoCSS icon classes (e.g. Iconify icon sets like `carbon`, `ri`, `tabler`).',
      },
    },
  },
  argTypes: {
    icon: { control: 'text', description: 'UnoCSS icon class name (e.g. `i-carbon-settings`)' },
  },
} satisfies Meta<typeof NIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: 'i-carbon-settings',
  },
}

export const DifferentIcons: Story = {
  render: () => ({
    components: { NIcon },
    template: `
      <div style="display: flex; gap: 16px; font-size: 24px;">
        <NIcon icon="i-carbon-settings" />
        <NIcon icon="i-carbon-search" />
        <NIcon icon="i-carbon-close" />
        <NIcon icon="i-carbon-checkmark" />
        <NIcon icon="i-carbon-warning" />
        <NIcon icon="i-carbon-information" />
      </div>
    `,
  }),
}

export const CustomSize: Story = {
  render: () => ({
    components: { NIcon },
    template: `
      <div style="display: flex; gap: 16px; align-items: center;">
        <NIcon icon="i-carbon-star" style="font-size: 12px;" />
        <NIcon icon="i-carbon-star" style="font-size: 24px;" />
        <NIcon icon="i-carbon-star" style="font-size: 36px;" />
        <NIcon icon="i-carbon-star" style="font-size: 48px;" />
      </div>
    `,
  }),
}
