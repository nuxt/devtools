<script setup lang="ts">
defineProps<{
  icon?: string
  text?: string
}>()
</script>

<template>
  <div flex="~ gap2" items-center>
    <div v-if="icon" :class="icon" />
    <div>{{ text }}</div>
  </div>
</template>
