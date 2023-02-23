<script setup lang="ts">
defineProps<{
  icon?: string
}>()
</script>

<template>
  <div class="n-icon" :class="icon" />
</template>
