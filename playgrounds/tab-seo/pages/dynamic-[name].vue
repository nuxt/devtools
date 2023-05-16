<script setup lang="ts">
const route = useRoute()

const name = computed(() => route.params.name as string)

useHead({
  title: `Nuxt is ${name.value}!`,
  meta: [
    { property: 'og:image', content: `https://cataas.com/cat/says/Nuxt%20is%20${name.value}!?width=480&height=300` },
  ],
})
</script>

<template>
  <div>
    Dynamic, {{ name }}!
  </div>
</template>
