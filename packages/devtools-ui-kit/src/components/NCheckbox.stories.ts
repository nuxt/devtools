import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import { ref } from 'vue'
import NCheckbox from './NCheckbox.vue'

const meta = {
  title: 'UI Kit/Forms/NCheckbox',
  component: NCheckbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A checkbox input with v-model support and disabled state.',
      },
    },
  },
  argTypes: {
    modelValue: { control: 'boolean', description: 'Checked state (v-model)' },
    disabled: { control: 'boolean', description: 'Disable the checkbox' },
  },
} satisfies Meta<typeof NCheckbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { NCheckbox },
    setup() {
      const checked = ref(false)
      return { args, checked }
    },
    template: '<NCheckbox v-model="checked" v-bind="args">Accept terms</NCheckbox>',
  }),
}

export const Checked: Story = {
  render: () => ({
    components: { NCheckbox },
    setup() {
      const checked = ref(true)
      return { checked }
    },
    template: '<NCheckbox v-model="checked">Already checked</NCheckbox>',
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { NCheckbox },
    template: '<NCheckbox disabled>Disabled option</NCheckbox>',
  }),
}

export const CheckboxGroup: Story = {
  render: () => ({
    components: { NCheckbox },
    setup() {
      const options = ref({ a: true, b: false, c: true })
      return { options }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <NCheckbox v-model="options.a">Option A</NCheckbox>
        <NCheckbox v-model="options.b">Option B</NCheckbox>
        <NCheckbox v-model="options.c">Option C</NCheckbox>
      </div>
    `,
  }),
}
