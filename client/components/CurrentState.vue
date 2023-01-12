<script setup lang="ts">
const client = useClient()
const matched = $computed(() => [...client.value?.nuxt?.vueApp.config.globalProperties.$route.matched || []])
</script>

<template>
  <div>Matched routes</div>
  <template v-for="i, idx of matched" :key="idx">
    <ComponentItem v-if="i.components?.default" :component="i.components?.default as any" />
  </template>
</template>
