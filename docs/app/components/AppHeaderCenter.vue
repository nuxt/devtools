<script setup lang="ts">
const links = [
  {
    label: 'Documentation',
    to: '/guide/getting-started',
  },
  {
    label: 'Playground',
    to: '/playground',
  },
  {
    label: 'Releases',
    to: 'https://github.com/nuxt/devtools/releases',
    target: '_blank',
  },
]
</script>

<template>
  <UNavigationMenu
    :items="links"
    variant="link"
  />
</template>
