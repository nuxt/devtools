<script setup lang="ts">
const { data: hello } = await useFetch('/api/hello')
</script>

<template>
  <div>
    <h1>Nuxt 5 ecosystem playground</h1>
    <p>Nitro v3 (package <code>nitro</code>) — <code>nitropack</code> is absent.</p>
    <pre>{{ hello }}</pre>
  </div>
</template>
