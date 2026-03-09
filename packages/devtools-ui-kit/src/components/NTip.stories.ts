import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import NTip from './NTip.vue'

const meta = {
  title: 'UI Kit/Data Display/NTip',
  component: NTip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A tip/hint component that displays an icon alongside informational text.',
      },
    },
  },
  argTypes: {
    icon: { control: 'text', description: 'UnoCSS icon class for the tip icon' },
  },
} satisfies Meta<typeof NTip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: 'i-carbon-information',
  },
  render: args => ({
    components: { NTip },
    setup() {
      return { args }
    },
    template: '<NTip v-bind="args">This is a helpful tip for users.</NTip>',
  }),
}

export const WithoutIcon: Story = {
  render: () => ({
    components: { NTip },
    template: '<NTip>A tip without an icon.</NTip>',
  }),
}

export const CustomIconSlot: Story = {
  render: () => ({
    components: { NTip },
    template: `
      <NTip>
        <template #icon>💡</template>
        Tip with a custom icon slot.
      </NTip>
    `,
  }),
}
