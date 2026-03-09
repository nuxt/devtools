import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import NSectionBlock from './NSectionBlock.vue'

const meta = {
  title: 'UI Kit/Layout/NSectionBlock',
  component: NSectionBlock,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A collapsible section with icon, title, description, and action slots. Uses `<details>` natively.',
      },
    },
  },
  argTypes: {
    icon: { control: 'text', description: 'UnoCSS icon class' },
    text: { control: 'text', description: 'Section title' },
    description: { control: 'text', description: 'Section description' },
    open: { control: 'boolean', description: 'Whether the section is open' },
    collapse: { control: 'boolean', description: 'Whether the section is collapsible' },
    padding: { control: 'boolean', description: 'Apply padding to content' },
    containerClass: { control: 'text', description: 'CSS class for the content container' },
  },
} satisfies Meta<typeof NSectionBlock>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: 'i-carbon-settings',
    text: 'Settings',
    description: 'Manage your application settings',
  },
  render: args => ({
    components: { NSectionBlock },
    setup() {
      return { args }
    },
    template: `
      <NSectionBlock v-bind="args">
        <div>Section content goes here.</div>
      </NSectionBlock>
    `,
  }),
}

export const Closed: Story = {
  args: {
    icon: 'i-carbon-code',
    text: 'Advanced',
    description: 'Advanced options',
    open: false,
  },
  render: args => ({
    components: { NSectionBlock },
    setup() {
      return { args }
    },
    template: `
      <NSectionBlock v-bind="args">
        <div>Hidden content until expanded.</div>
      </NSectionBlock>
    `,
  }),
}

export const NonCollapsible: Story = {
  args: {
    icon: 'i-carbon-information',
    text: 'Information',
    collapse: false,
  },
  render: args => ({
    components: { NSectionBlock },
    setup() {
      return { args }
    },
    template: `
      <NSectionBlock v-bind="args">
        <div>This section cannot be collapsed.</div>
      </NSectionBlock>
    `,
  }),
}

export const WithActions: Story = {
  render: () => ({
    components: { NSectionBlock },
    template: `
      <NSectionBlock icon="i-carbon-list" text="Items" description="List of items">
        <template #actions>
          <NButton icon="i-carbon-add">Add</NButton>
        </template>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </NSectionBlock>
    `,
  }),
}

export const MultipleSections: Story = {
  render: () => ({
    components: { NSectionBlock },
    template: `
      <div>
        <NSectionBlock icon="i-carbon-user" text="Profile" description="User profile settings">
          <div>Profile content</div>
        </NSectionBlock>
        <NSectionBlock icon="i-carbon-notification" text="Notifications" description="Notification preferences">
          <div>Notification settings</div>
        </NSectionBlock>
        <NSectionBlock icon="i-carbon-security" text="Security" description="Security and privacy" :open="false">
          <div>Security content</div>
        </NSectionBlock>
      </div>
    `,
  }),
}
