import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import NDropdown from './NDropdown.vue'

const meta = {
  title: 'UI Kit/Overlay/NDropdown',
  component: NDropdown,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A dropdown menu with toggle trigger. Closes on click outside. Supports start/end alignment.',
      },
    },
  },
  argTypes: {
    modelValue: { control: 'boolean', description: 'Open state (v-model)' },
    direction: {
      control: 'select',
      options: ['start', 'end'],
      description: 'Alignment of dropdown menu',
    },
  },
} satisfies Meta<typeof NDropdown>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { NDropdown },
    setup() {
      return { args }
    },
    template: `
      <div style="padding: 16px;">
        <NDropdown v-bind="args">
          <div style="padding: 8px; min-width: 150px;">
            <div style="padding: 4px 8px; cursor: pointer;">Option 1</div>
            <div style="padding: 4px 8px; cursor: pointer;">Option 2</div>
            <div style="padding: 4px 8px; cursor: pointer;">Option 3</div>
          </div>
        </NDropdown>
      </div>
    `,
  }),
}

export const CustomTrigger: Story = {
  render: () => ({
    components: { NDropdown },
    template: `
      <div style="padding: 16px;">
        <NDropdown>
          <template #trigger="{ click }">
            <NButton icon="i-carbon-overflow-menu-vertical" @click="click" />
          </template>
          <div style="padding: 8px; min-width: 150px;">
            <div style="padding: 4px 8px; cursor: pointer;">Edit</div>
            <div style="padding: 4px 8px; cursor: pointer;">Duplicate</div>
            <div style="padding: 4px 8px; cursor: pointer; color: red;">Delete</div>
          </div>
        </NDropdown>
      </div>
    `,
  }),
}

export const EndAligned: Story = {
  render: () => ({
    components: { NDropdown },
    template: `
      <div style="padding: 16px; display: flex; justify-content: flex-end;">
        <NDropdown direction="end">
          <template #trigger="{ click }">
            <NButton icon="i-carbon-settings" @click="click">Settings</NButton>
          </template>
          <div style="padding: 8px; min-width: 150px;">
            <div style="padding: 4px 8px; cursor: pointer;">Profile</div>
            <div style="padding: 4px 8px; cursor: pointer;">Preferences</div>
            <div style="padding: 4px 8px; cursor: pointer;">Logout</div>
          </div>
        </NDropdown>
      </div>
    `,
  }),
}
