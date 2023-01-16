<script setup lang="ts">
import type { ClientFunctions } from '../src/types'

import 'floating-vue/dist/style.css'

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
  refresh(type) {
    if (route.path.includes(type)) {
      router.replace({
        path: route.path,
        query: {
          t: Date.now(),
        },
      })
    }
  },
} satisfies ClientFunctions)
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
