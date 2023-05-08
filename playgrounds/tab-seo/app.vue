<script setup lang="ts">
useHead({
  title: 'Default Page',
  meta: [
    {
      property: 'og:title',
      content: 'Default Page',
    },
  ],
})
</script>

<template>
  <GlobalNav />
  <div px10 text-6xl>
    <NuxtPage />
  </div>
</template>
