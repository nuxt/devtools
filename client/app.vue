<script setup lang="ts">
import type { ClientFunctions } from '../src/types'

import 'floating-vue/dist/style.css'
import './styles/global.css'

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

const router = useRouter()
const route = useRoute()

Object.assign(clientFunctions, {
  async refresh(type) {
    if (route.path.includes(type)) {
      router.replace({
        path: route.path,
        query: {
          t: Date.now(),
        },
      })
    }
    if (type === 'customTabs')
      await updateTabs()
  },
} satisfies ClientFunctions)

await updateTabs()
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
.dark {
  color-scheme: dark;
}
</style>
