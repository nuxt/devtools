<script setup lang="ts">
defineProps<{
  icon?: string
  text?: string
}>()
</script>

<template>
  <div flex="~ gap-3" items-center>
    <div v-if="icon" :class="icon" />
    <slot>
      <div>{{ text }}</div>
    </slot>
  </div>
</template>
