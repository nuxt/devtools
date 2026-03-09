import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import { ref } from 'vue'
import NNavbar from './NNavbar.vue'

const meta = {
  title: 'UI Kit/Layout/NNavbar',
  component: NNavbar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A navigation bar component with optional search input and action slots.',
      },
    },
  },
  argTypes: {
    search: { control: 'text', description: 'Search text (v-model:search). Pass to enable search input.' },
    noPadding: { control: 'boolean', description: 'Remove default padding' },
  },
} satisfies Meta<typeof NNavbar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { NNavbar },
    template: `
      <NNavbar>
        <template #actions>
          <NButton icon="i-carbon-settings" />
        </template>
      </NNavbar>
    `,
  }),
}

export const WithSearch: Story = {
  render: () => ({
    components: { NNavbar },
    setup() {
      const search = ref('')
      return { search }
    },
    template: `
      <NNavbar v-model:search="search">
        <template #actions>
          <NButton icon="i-carbon-filter" />
        </template>
      </NNavbar>
    `,
  }),
}

export const WithContent: Story = {
  render: () => ({
    components: { NNavbar },
    setup() {
      const search = ref('')
      return { search }
    },
    template: `
      <NNavbar v-model:search="search">
        <template #actions>
          <NButton icon="i-carbon-add">Add</NButton>
          <NButton icon="i-carbon-filter">Filter</NButton>
        </template>
        <div style="opacity: 0.6; font-size: 0.875rem;">Showing 42 results</div>
      </NNavbar>
    `,
  }),
}
