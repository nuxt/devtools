import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import NLoading from './NLoading.vue'

const meta = {
  title: 'UI Kit/Data Display/NLoading',
  component: NLoading,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A loading indicator with a spinning icon and customizable text.',
      },
    },
  },
} satisfies Meta<typeof NLoading>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { NLoading },
    template: '<div style="height: 200px;"><NLoading /></div>',
  }),
}

export const CustomText: Story = {
  render: () => ({
    components: { NLoading },
    template: '<div style="height: 200px;"><NLoading>Fetching data...</NLoading></div>',
  }),
}
