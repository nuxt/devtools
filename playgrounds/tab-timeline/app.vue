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
  <div px10 pt-10 text-4xl>
    Timeline Example
  </div>
  <GlobalNav />
  <NCard mx10 border-dashed p6>
    <NuxtPage />
  </NCard>
</template>

<style>
html.dark {
  background: #050505;
}
</style>
