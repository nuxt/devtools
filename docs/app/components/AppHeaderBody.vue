<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const nav = computed(() => ([
  {
    title: 'Documentation',
    icon: 'i-heroicons-book-open-solid',
    path: '/get-started/installation',
    children: navigation!.value,
  },
  {
    title: 'Playground',
    icon: 'i-ph-play-duotone',
    path: '/playground',
  },
  {
    title: 'Releases',
    icon: 'i-heroicons-rocket-launch-solid',
    path: 'https://github.com/nuxt/image/releases',
    target: '_blank',
  },
]))
</script>

<template>
  <UContentNavigation
    highlight
    variant="link"
    :navigation="nav"
  />
</template>
