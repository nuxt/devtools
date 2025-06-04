<script setup lang="ts">
function handleClick() {
  // eslint-disable-next-line no-console
  console.log('clicked')
}
</script>

<template>
  <h1>Hello</h1>
  <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
    <a href="https://nuxt.com">Nuxt</a>
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
