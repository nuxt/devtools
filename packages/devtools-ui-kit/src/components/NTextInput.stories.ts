import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import { ref } from 'vue'
import NTextInput from './NTextInput.vue'

const meta = {
  title: 'UI Kit/Forms/NTextInput',
  component: NTextInput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A styled text input with v-model support, icon, placeholder, and various input types.',
      },
    },
  },
  argTypes: {
    modelValue: { control: 'text', description: 'Input value (v-model)' },
    icon: { control: 'text', description: 'UnoCSS icon class' },
    placeholder: { control: 'text', description: 'Placeholder text' },
    disabled: { control: 'boolean', description: 'Disable the input' },
    readonly: { control: 'boolean', description: 'Make input read-only' },
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'url'],
      description: 'Input type',
    },
  },
} satisfies Meta<typeof NTextInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { NTextInput },
    setup() {
      const value = ref('')
      return { args, value }
    },
    template: '<NTextInput v-model="value" v-bind="args" placeholder="Type something..." />',
  }),
}

export const WithIcon: Story = {
  render: () => ({
    components: { NTextInput },
    setup() {
      const value = ref('')
      return { value }
    },
    template: '<NTextInput v-model="value" icon="i-carbon-search" placeholder="Search..." />',
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { NTextInput },
    setup() {
      const value = ref('Cannot edit')
      return { value }
    },
    template: '<NTextInput v-model="value" disabled />',
  }),
}

export const Readonly: Story = {
  render: () => ({
    components: { NTextInput },
    setup() {
      const value = ref('Read-only text')
      return { value }
    },
    template: '<NTextInput v-model="value" readonly />',
  }),
}

export const PasswordInput: Story = {
  render: () => ({
    components: { NTextInput },
    setup() {
      const value = ref('')
      return { value }
    },
    template: '<NTextInput v-model="value" type="password" icon="i-carbon-locked" placeholder="Enter password" />',
  }),
}
