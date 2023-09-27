<script setup lang="ts">
import 'floating-vue/dist/style.css'
import 'vanilla-jsoneditor/themes/jse-theme-dark.css'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import './styles/global.css'
import { setupClientRPC } from './setup/client-rpc'
import { splitScreenAvailable } from '~/composables/storage'

if (process.client)
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

setupClientRPC()

const client = useClient()
const route = useRoute()
const colorMode = useColorMode()
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

addEventListener('keydown', (e) => {
  if (e.code === 'KeyD' && e.altKey) {
    client.value?.devtools.close()
    e.preventDefault()
  }
})

const { scale, sidebarExpanded } = useDevToolsUIOptions()
const dataSchema = useSchemaInput()

onMounted(() => {
  const injectClient = useInjectionClient()
  watchEffect(() => {
    window.__NUXT_DEVTOOLS__ = injectClient.value
  })

  watchEffect(() => {
    document.body.style.fontSize = `${scale.value * 15}px`
  })
})

registerCommands(() =>
  splitScreenAvailable.value
    ? [
        {
          id: 'action:split-screen',
          title: `${splitScreenEnabled.value ? 'Close' : 'Open'} Split Screen`,
          icon: 'i-carbon-split-screen',
          action: () => {
            splitScreenEnabled.value = !splitScreenEnabled.value
          },
        },
      ]
    : [])
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
      h-full h-screen of-hidden font-sans bg-base
    >
      <SideNav v-show="!isUtilityView" of-x-hidden of-y-auto />
      <NuxtLayout>
        <NSplitPane storage-key="devtools:split-screen-mode" :min-size="20">
          <template #left>
            <NuxtPage />
          </template>
          <template v-if="splitScreenEnabled && splitScreenAvailable" #right>
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
