import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import { ref } from 'vue'
import NDialog from './NDialog.vue'

const meta = {
  title: 'UI Kit/Overlay/NDialog',
  component: NDialog,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A modal dialog with backdrop dimming, focus trap, and click-outside-to-close. Uses Teleport to render at document body.',
      },
    },
  },
  argTypes: {
    modelValue: { control: 'boolean', description: 'Show/hide the dialog (v-model)' },
    dim: { control: 'boolean', description: 'Dim the backdrop' },
    autoClose: { control: 'boolean', description: 'Close on click outside' },
  },
} satisfies Meta<typeof NDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { NDialog },
    setup() {
      const show = ref(false)
      return { args, show }
    },
    template: `
      <div>
        <NButton @click="show = true">Open Dialog</NButton>
        <NDialog v-model="show" v-bind="args">
          <div style="padding: 24px; min-width: 300px;">
            <h3 style="margin: 0 0 12px;">Dialog Title</h3>
            <p style="margin: 0 0 16px; opacity: 0.7;">This is a dialog with some content.</p>
            <NButton @click="show = false">Close</NButton>
          </div>
        </NDialog>
      </div>
    `,
  }),
}

export const NoDim: Story = {
  render: () => ({
    components: { NDialog },
    setup() {
      const show = ref(false)
      return { show }
    },
    template: `
      <div>
        <NButton @click="show = true">Open (no dim)</NButton>
        <NDialog v-model="show" :dim="false">
          <div style="padding: 24px;">
            <p>Dialog without backdrop dimming.</p>
            <NButton @click="show = false">Close</NButton>
          </div>
        </NDialog>
      </div>
    `,
  }),
}

export const NoAutoClose: Story = {
  render: () => ({
    components: { NDialog },
    setup() {
      const show = ref(false)
      return { show }
    },
    template: `
      <div>
        <NButton @click="show = true">Open (no auto-close)</NButton>
        <NDialog v-model="show" :auto-close="false">
          <div style="padding: 24px;">
            <p>Click outside won't close this dialog.</p>
            <NButton @click="show = false">Close manually</NButton>
          </div>
        </NDialog>
      </div>
    `,
  }),
}
