import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import { ref } from 'vue'
import NSelectTabs from './NSelectTabs.vue'

const meta = {
  title: 'UI Kit/Forms/NSelectTabs',
  component: NSelectTabs,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A tab-style selector where each option is rendered as a toggle tab. Supports v-model.',
      },
    },
  },
  argTypes: {
    modelValue: { control: 'text', description: 'Selected value (v-model)' },
    disabled: { control: 'boolean', description: 'Disable all tabs' },
    options: { control: 'object', description: 'Array of { value, label } objects' },
  },
} satisfies Meta<typeof NSelectTabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { NSelectTabs },
    setup() {
      const value = ref('all')
      const options = [
        { value: 'all', label: 'All' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ]
      return { args, value, options }
    },
    template: '<NSelectTabs v-model="value" :options="options" v-bind="args" />',
  }),
}

export const ManyOptions: Story = {
  render: () => ({
    components: { NSelectTabs },
    setup() {
      const value = ref('sm')
      const options = [
        { value: 'xs', label: 'XS' },
        { value: 'sm', label: 'SM' },
        { value: 'md', label: 'MD' },
        { value: 'lg', label: 'LG' },
        { value: 'xl', label: 'XL' },
      ]
      return { value, options }
    },
    template: '<NSelectTabs v-model="value" :options="options" />',
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { NSelectTabs },
    setup() {
      const value = ref('a')
      const options = [
        { value: 'a', label: 'Option A' },
        { value: 'b', label: 'Option B' },
      ]
      return { value, options }
    },
    template: '<NSelectTabs v-model="value" :options="options" disabled />',
  }),
}
