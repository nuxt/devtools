import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import { ref } from 'vue'
import NRadio from './NRadio.vue'

const meta = {
  title: 'UI Kit/Forms/NRadio',
  component: NRadio,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A radio input with v-model support, grouping via `name`, and disabled state.',
      },
    },
  },
  argTypes: {
    modelValue: { control: 'text', description: 'Selected value (v-model)' },
    value: { control: 'text', description: 'Value of this radio option' },
    name: { control: 'text', description: 'Group name for radio buttons' },
    disabled: { control: 'boolean', description: 'Disable the radio button' },
  },
} satisfies Meta<typeof NRadio>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { NRadio },
    setup() {
      const selected = ref('a')
      return { selected }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <NRadio v-model="selected" name="demo" value="a">Option A</NRadio>
        <NRadio v-model="selected" name="demo" value="b">Option B</NRadio>
        <NRadio v-model="selected" name="demo" value="c">Option C</NRadio>
        <div style="margin-top: 8px; opacity: 0.6;">Selected: {{ selected }}</div>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { NRadio },
    setup() {
      const selected = ref('a')
      return { selected }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <NRadio v-model="selected" name="disabled-demo" value="a">Enabled</NRadio>
        <NRadio v-model="selected" name="disabled-demo" value="b" disabled>Disabled</NRadio>
      </div>
    `,
  }),
}
