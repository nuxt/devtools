import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import NDarkToggle from './NDarkToggle.vue'

const meta = {
  title: 'UI Kit/Utilities/NDarkToggle',
  component: NDarkToggle,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A renderless dark mode toggle component. Provides `isDark`, `toggle`, and `mode` via scoped slot. Uses view transitions when available.',
      },
    },
  },
} satisfies Meta<typeof NDarkToggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { NDarkToggle },
    template: `
      <NDarkToggle v-slot="{ isDark, toggle }">
        <NButton @click="toggle" :icon="isDark ? 'i-carbon-moon' : 'i-carbon-sun'">
          {{ isDark ? 'Dark' : 'Light' }} mode
        </NButton>
      </NDarkToggle>
    `,
  }),
}

export const IconOnly: Story = {
  render: () => ({
    components: { NDarkToggle },
    template: `
      <NDarkToggle v-slot="{ isDark, toggle }">
        <NButton @click="toggle" :icon="isDark ? 'i-carbon-moon' : 'i-carbon-sun'" />
      </NDarkToggle>
    `,
  }),
}
