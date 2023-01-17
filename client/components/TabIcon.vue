<script setup lang="ts">
defineProps<{
  icon?: string
  title?: string
}>()
</script>

<template>
  <img
    v-if="icon && (icon.startsWith('/') || icon.match(/^https?:/))"
    v-bind="$attrs"
    :style="{
      width: '1em',
      height: '1em',
    }"
    :src="icon"
    :alt="title"
  >
  <div
    v-else
    v-bind="$attrs"
    :class="icon || 'carbon-bring-forward'"
    :title="title"
  />
</template>
