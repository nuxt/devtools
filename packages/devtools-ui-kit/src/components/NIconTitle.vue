<script setup lang="ts">
defineProps<{
  icon?: string
  text?: string
}>()
</script>

<template>
  <div class="items-center flex flex-gap2">
    <div v-if="icon" :class="icon" />
    <slot>
      <div>{{ text }}</div>
    </slot>
  </div>
</template>
