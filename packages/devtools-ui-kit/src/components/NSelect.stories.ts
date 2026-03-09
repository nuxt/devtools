import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import { ref } from 'vue'
import NSelect from './NSelect.vue'

const meta = {
  title: 'UI Kit/Forms/NSelect',
  component: NSelect,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A styled select dropdown with v-model support, icon, placeholder, and disabled state.',
      },
    },
  },
  argTypes: {
    modelValue: { control: 'text', description: 'Selected value (v-model)' },
    placeholder: { control: 'text', description: 'Placeholder text' },
    icon: { control: 'text', description: 'UnoCSS icon class' },
    disabled: { control: 'boolean', description: 'Disable the select' },
  },
} satisfies Meta<typeof NSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { NSelect },
    setup() {
      const value = ref('')
      return { args, value }
    },
    template: `
      <NSelect v-model="value" v-bind="args" placeholder="Choose a framework">
        <option value="nuxt">Nuxt</option>
        <option value="vue">Vue</option>
        <option value="react">React</option>
        <option value="svelte">Svelte</option>
      </NSelect>
    `,
  }),
}

export const WithIcon: Story = {
  render: () => ({
    components: { NSelect },
    setup() {
      const value = ref('')
      return { value }
    },
    template: `
      <NSelect v-model="value" icon="i-carbon-development" placeholder="Select language">
        <option value="ts">TypeScript</option>
        <option value="js">JavaScript</option>
        <option value="py">Python</option>
      </NSelect>
    `,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { NSelect },
    setup() {
      const value = ref('nuxt')
      return { value }
    },
    template: `
      <NSelect v-model="value" disabled>
        <option value="nuxt">Nuxt</option>
      </NSelect>
    `,
  }),
}
