import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import NButton from './NButton'

const meta = {
  title: 'UI Kit/Forms/NButton',
  component: NButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A versatile button component supporting icons, links, and disabled state. Renders as `<button>` or `<NuxtLink>` when `to` is provided.',
      },
    },
  },
  argTypes: {
    icon: { control: 'text', description: 'UnoCSS icon class' },
    to: { control: 'text', description: 'Link target (renders as NuxtLink)' },
    border: { control: 'boolean', description: 'Show border styling' },
    disabled: { control: 'boolean', description: 'Disable the button' },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'Button type attribute',
    },
  },
} satisfies Meta<typeof NButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => ({
    components: { NButton },
    setup() {
      return { args }
    },
    template: '<NButton v-bind="args">Click me</NButton>',
  }),
}

export const WithIcon: Story = {
  render: () => ({
    components: { NButton },
    template: '<NButton icon="i-carbon-add">Add item</NButton>',
  }),
}

export const IconOnly: Story = {
  render: () => ({
    components: { NButton },
    template: '<NButton icon="i-carbon-settings" />',
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { NButton },
    template: '<NButton disabled icon="i-carbon-locked">Disabled</NButton>',
  }),
}

export const NoBorder: Story = {
  render: () => ({
    components: { NButton },
    template: '<NButton :border="false" icon="i-carbon-close" />',
  }),
}

export const ButtonGroup: Story = {
  render: () => ({
    components: { NButton },
    template: `
      <div style="display: flex; gap: 8px;">
        <NButton icon="i-carbon-save">Save</NButton>
        <NButton icon="i-carbon-reset">Reset</NButton>
        <NButton icon="i-carbon-close">Cancel</NButton>
      </div>
    `,
  }),
}
