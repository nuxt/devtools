import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import NSplitPane from './NSplitPane.vue'

const meta = {
  title: 'UI Kit/Layout/NSplitPane',
  component: NSplitPane,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A resizable split pane layout using `splitpanes`. Supports horizontal/vertical orientation and persistent sizing via localStorage.',
      },
    },
  },
  argTypes: {
    horizontal: { control: 'boolean', description: 'Use horizontal split (top/bottom)' },
    leftSize: { control: { type: 'range', min: 10, max: 90 }, description: 'Initial left pane size (%)' },
    minSize: { control: { type: 'range', min: 5, max: 50 }, description: 'Minimum pane size (%)' },
    storageKey: { control: 'text', description: 'Key for persisting pane size in localStorage' },
  },
} satisfies Meta<typeof NSplitPane>

export default meta
type Story = StoryObj<typeof meta>

export const Vertical: Story = {
  render: args => ({
    components: { NSplitPane },
    setup() {
      return { args }
    },
    template: `
      <div style="height: 400px; border: 1px solid var(--n-border-color, #e5e7eb);">
        <NSplitPane v-bind="args">
          <template #left>
            <div style="padding: 16px;">Left Pane</div>
          </template>
          <template #right>
            <div style="padding: 16px;">Right Pane</div>
          </template>
        </NSplitPane>
      </div>
    `,
  }),
}

export const Horizontal: Story = {
  args: {
    horizontal: true,
  },
  render: args => ({
    components: { NSplitPane },
    setup() {
      return { args }
    },
    template: `
      <div style="height: 400px; border: 1px solid var(--n-border-color, #e5e7eb);">
        <NSplitPane v-bind="args">
          <template #left>
            <div style="padding: 16px;">Top Pane</div>
          </template>
          <template #right>
            <div style="padding: 16px;">Bottom Pane</div>
          </template>
        </NSplitPane>
      </div>
    `,
  }),
}

export const CustomSize: Story = {
  args: {
    leftSize: 70,
    minSize: 20,
  },
  render: args => ({
    components: { NSplitPane },
    setup() {
      return { args }
    },
    template: `
      <div style="height: 400px; border: 1px solid var(--n-border-color, #e5e7eb);">
        <NSplitPane v-bind="args">
          <template #left>
            <div style="padding: 16px;">Wider pane (70%)</div>
          </template>
          <template #right>
            <div style="padding: 16px;">Narrower pane (30%)</div>
          </template>
        </NSplitPane>
      </div>
    `,
  }),
}
