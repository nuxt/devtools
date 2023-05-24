<script setup lang="ts">
import 'floating-vue/dist/style.css'
import 'vanilla-jsoneditor/themes/jse-theme-dark.css'
import 'splitpanes/dist/splitpanes.css'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import './styles/global.css'
import { setupClientRPC } from './setup/client-rpc'

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
const isUtilityView = computed(() => route.path.startsWith('/__'))
const waiting = computed(() => !client.value && !showConnectionWarning.value)

addEventListener('keydown', (e) => {
  if (e.code === 'KeyD' && e.altKey) {
    client.value?.closeDevTools()
    e.preventDefault()
  }
})

const {
  scale,
} = useDevToolsOptions()

onMounted(() => {
  const injectClient = useInjectionClient()
  watchEffect(() => {
    window.__NUXT_DEVTOOLS__ = injectClient.value
  })

  watchEffect(() => {
    document.body.style.fontSize = `${scale.value * 15}px`
  })
})
</script>

<template>
  <div fixed inset-0 h-screen w-screen>
    <NuxtLoadingIndicator />
    <Notification />
    <NLoading v-if="waiting">
      Connecting....
    </NLoading>
    <div
      v-else :grid="isUtilityView ? 'flex' : '~ cols-[50px_1fr]'"
      h-full h-screen of-hidden font-sans bg-base
    >
      <SideNav v-show="!isUtilityView" of-x-hidden of-y-auto />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
      <CommandPalette />
    </div>
    <DisconnectIndicator />
    <RestartDialogs />
  </div>
</template>
