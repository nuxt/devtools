<script setup lang="ts">
const { error } = await useAsyncData('failing', () => failingTask())
</script>

<template>
  <div>
    <h2>Error</h2>
    <div data-testid="error">
      {{ error?.message ?? 'no error' }}
    </div>
  </div>
</template>
