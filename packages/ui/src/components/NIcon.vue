<template>
  <div class="n-icon" :class="icon" />
</template>

<script setup lang="ts">
defineProps<{
  icon?: string
}>()
</script>
