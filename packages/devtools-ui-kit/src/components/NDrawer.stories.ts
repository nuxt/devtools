import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import { ref } from 'vue'
import NDrawer from './NDrawer.vue'

const meta = {
  title: 'UI Kit/Overlay/NDrawer',
  component: NDrawer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A slide-in drawer panel. Supports right, top, and bottom transitions. Includes a close button.',
      },
    },
  },
  argTypes: {
    modelValue: { control: 'boolean', description: 'Show/hide the drawer (v-model)' },
    transition: {
      control: 'select',
      options: ['right', 'top', 'bottom'],
      description: 'Slide-in direction',
    },
    autoClose: { control: 'boolean', description: 'Close on click outside' },
  },
} satisfies Meta<typeof NDrawer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { NDrawer },
    setup() {
      const show = ref(false)
      return { args, show }
    },
    template: `
      <div style="position: relative; height: 400px; border: 1px solid var(--n-border-color, #e5e7eb); overflow: hidden;">
        <div style="padding: 16px;">
          <NButton @click="show = true">Open Drawer</NButton>
        </div>
        <NDrawer v-model="show" v-bind="args" @close="show = false" style="width: 300px;">
          <div style="padding: 48px 16px 16px;">
            <h3>Drawer Content</h3>
            <p style="opacity: 0.7;">This is a drawer panel.</p>
          </div>
        </NDrawer>
      </div>
    `,
  }),
}

export const BottomTransition: Story = {
  render: () => ({
    components: { NDrawer },
    setup() {
      const show = ref(false)
      return { show }
    },
    template: `
      <div style="position: relative; height: 400px; border: 1px solid var(--n-border-color, #e5e7eb); overflow: hidden;">
        <div style="padding: 16px;">
          <NButton @click="show = true">Open Bottom Drawer</NButton>
        </div>
        <NDrawer v-model="show" transition="bottom" @close="show = false" style="height: 200px;">
          <div style="padding: 48px 16px 16px;">
            <p>Sliding in from the bottom.</p>
          </div>
        </NDrawer>
      </div>
    `,
  }),
}
