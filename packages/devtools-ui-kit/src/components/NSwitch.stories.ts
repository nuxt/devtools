import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import { ref } from 'vue'
import NSwitch from './NSwitch.vue'

const meta = {
  title: 'UI Kit/Forms/NSwitch',
  component: NSwitch,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A toggle switch with v-model support and disabled state.',
      },
    },
  },
  argTypes: {
    modelValue: { control: 'boolean', description: 'Toggle state (v-model)' },
    disabled: { control: 'boolean', description: 'Disable the switch' },
  },
} satisfies Meta<typeof NSwitch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { NSwitch },
    setup() {
      const enabled = ref(false)
      return { args, enabled }
    },
    template: '<NSwitch v-model="enabled" v-bind="args">Dark mode</NSwitch>',
  }),
}

export const On: Story = {
  render: () => ({
    components: { NSwitch },
    setup() {
      const enabled = ref(true)
      return { enabled }
    },
    template: '<NSwitch v-model="enabled">Enabled</NSwitch>',
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { NSwitch },
    template: '<NSwitch disabled>Cannot toggle</NSwitch>',
  }),
}

export const SwitchGroup: Story = {
  render: () => ({
    components: { NSwitch },
    setup() {
      const notifications = ref(true)
      const sounds = ref(false)
      const analytics = ref(true)
      return { notifications, sounds, analytics }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <NSwitch v-model="notifications">Notifications</NSwitch>
        <NSwitch v-model="sounds">Sounds</NSwitch>
        <NSwitch v-model="analytics">Analytics</NSwitch>
      </div>
    `,
  }),
}
