<script setup lang="ts">
defineProps<{
  icon?: string
}>()
</script>

<template>
  <div class="n-tip n-tip-base">
    <slot name="icon">
      <NIcon v-if="icon" :icon="icon" class="n-tip-icon" />
    </slot>
    <div>
      <slot />
    </div>
  </div>
</template>
