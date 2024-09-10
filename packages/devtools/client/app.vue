<script setup lang="ts">
import { useEyeDropper } from '@vueuse/core'
import { splitScreenAvailable } from '~/composables/storage'
import { setupClientRPC } from './setup/client-rpc'
import { setupVueDevTools } from './setup/vue-devtools'

import 'floating-vue/dist/style.css'
import '@vue/devtools-applet/style.css'
import 'vanilla-jsoneditor/themes/jse-theme-dark.css'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import './styles/global.css'

if (import.meta.client)
  import('./setup/unocss-runtime')

useHead({
  title: 'Nuxt DevTools',
  meta: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: '/nuxt.svg',
    },
  ],
})

setupVueDevTools()
setupClientRPC()

const client = useClient()
const route = useRoute()
const colorMode = getColorMode()
const isUtilityView = computed(() => route.path.startsWith('/__') || route.path === '/')
const waiting = computed(() => !client.value && !showConnectionWarning.value)

watch(
  () => client.value?.app.colorMode.value,
  (mode) => {
    if (mode)
      colorMode.value = mode
  },
  { immediate: true },
)

useEventListener('keydown', (e) => {
  if (e.code === 'KeyD' && e.altKey) {
    client.value?.devtools.close()
    e.preventDefault()
  }
})

const { scale, sidebarExpanded } = useDevToolsUIOptions()
const dataSchema = useSchemaInput()

onMounted(async () => {
  const injectClient = useInjectionClient()
  watchEffect(() => {
    window.__NUXT_DEVTOOLS__ = injectClient.value
  })

  watchEffect(() => {
    document.body.style.fontSize = `${scale.value * 15}px`
  })

  if (!isDevAuthed.value) {
    if (devAuthToken.value) {
      const result = await rpc.verifyAuthToken(devAuthToken.value)
      if (result)
        isDevAuthed.value = true
    }
  }
})

const copy = useCopy()
const eyeDropper = useEyeDropper({})

registerCommands(() => [
  ...(splitScreenAvailable.value
    ? [{
        id: 'action:split-screen',
        title: `${splitScreenEnabled.value ? 'Close' : 'Open'} Split Screen`,
        icon: 'i-carbon-split-screen',
        action: () => {
          splitScreenEnabled.value = !splitScreenEnabled.value
        },
      }]
    : []),
  ...(eyeDropper.isSupported.value
    ? [{
        id: 'action:eye-dropper',
        title: 'Color Picker',
        icon: 'i-carbon-eyedropper',
        action: async () => {
          const { sRGBHex } = await eyeDropper.open() || {}
          if (sRGBHex)
            copy(sRGBHex)
        },
      }]
    : []),
  ...[
    {
      id: 'action:refresh-data',
      title: 'Refresh Data',
      icon: 'i-carbon-data-backup',
      action: refreshData,
    },
    {
      id: 'action:reload-page',
      title: 'Reload Page',
      icon: 'i-carbon-reset',
      action: reloadPage,
    },
  ],
])
</script>

<template>
  <div fixed inset-0 h-screen w-screen font-sans>
    <NuxtLoadingIndicator />
    <NNotification />
    <NLoading v-if="waiting">
      Connecting....
    </NLoading>
    <div
      v-else
      :class="isUtilityView ? 'flex' : sidebarExpanded ? 'grid grid-cols-[250px_1fr]' : 'grid grid-cols-[50px_1fr]'"
      h-full h-screen of-hidden rounded-xl font-sans bg-base
    >
      <SideNav v-show="!isUtilityView" of-x-hidden of-y-auto />
      <NuxtLayout>
        <NSplitPane storage-key="devtools:split-screen-mode" :min-size="20">
          <template #left>
            <NuxtPage />
          </template>
          <template v-if="!isUtilityView && splitScreenEnabled && splitScreenAvailable" #right>
            <SplitScreen />
          </template>
        </NSplitPane>
      </NuxtLayout>
      <CommandPalette />
      <AuthConfirmDialog />
    </div>
    <DisconnectIndicator />
    <RestartDialogs />
    <div v-lazy-show="dataSchema">
      <LazyDataSchemaDrawer />
    </div>
  </div>
</template>
