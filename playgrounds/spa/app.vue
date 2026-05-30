<script setup lang="ts">
function handleClick() {
  // eslint-disable-next-line no-console
  console.log('clicked')
}
</script>

<template>
  <h1>Hello (SPA mode)</h1>
  <p>
    This playground runs with <code>ssr: false</code>. The Nuxt DevTools dock
    entry should still appear in Vite DevTools.
  </p>
  <button @click="handleClick">
    Click me
  </button>
</template>

<style>
@media (prefers-color-scheme: dark) {
  html {
    color-scheme: dark;
  }
}
</style>
