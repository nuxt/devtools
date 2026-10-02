<script setup lang="ts">
const route = useRoute()
const { data } = await useAsyncData(`dynamic-${route.params.name}`, async () => {
  await slowTask(400)
  return `hello ${route.params.name}`
})
</script>

<template>
  <div>
    <h2>Dynamic: {{ route.params.name }}</h2>
    <div>{{ data }}</div>
    <NuxtLink to="/dynamic-foo">
      foo
    </NuxtLink>
    |
    <NuxtLink to="/dynamic-bar">
      bar
    </NuxtLink>
  </div>
</template>
