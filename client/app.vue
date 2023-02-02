<script setup lang="ts">
import 'floating-vue/dist/style.css'
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
addEventListener('keypress', (e) => {
  if (e.code === 'KeyD' && e.altKey)
    client.value?.closeDevTools()
})
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
