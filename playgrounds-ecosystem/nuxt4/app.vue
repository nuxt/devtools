<script setup lang="ts">
const { data: hello } = await useFetch('/api/hello')
</script>

<template>
  <div>
    <h1>Nuxt 4 ecosystem playground</h1>
    <p>Nitro v2 (package <code>nitropack</code>) — <code>nitro</code> (v3) is absent.</p>
    <pre>{{ hello }}</pre>
  </div>
</template>
