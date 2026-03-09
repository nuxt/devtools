import type { Meta, StoryObj } from '@storybook-vue/nuxt'
import NNotification from './NNotification.vue'

const meta = {
  title: 'UI Kit/Feedback/NNotification',
  component: NNotification,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A toast notification component. Controlled programmatically via `devtoolsUiShowNotification()`. Displays a brief message with optional icon and positioning.',
      },
    },
  },
} satisfies Meta<typeof NNotification>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The NNotification component is rendered once at the app root and triggered programmatically via `devtoolsUiShowNotification()`. Click the button to see the notification.',
      },
    },
  },
  render: () => ({
    components: { NNotification },
    setup() {
      // devtoolsUiShowNotification is auto-imported by the Nuxt module
      function notify() {
        try {
          devtoolsUiShowNotification({
            message: 'Action completed!',
            icon: 'i-carbon-checkmark',
            duration: 2000,
          })
        }
        catch {
          // composable may not be available outside DevTools context
        }
      }
      return { notify }
    },
    template: `
      <div>
        <NNotification />
        <NButton @click="notify" icon="i-carbon-notification">
          Show Notification
        </NButton>
        <p style="margin-top: 8px; opacity: 0.6; font-size: 0.875rem;">
          Note: Notification requires the devtools composable context to function fully.
        </p>
      </div>
    `,
  }),
}
