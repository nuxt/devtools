<script setup lang="ts">
defineProps<{
  icon?: string
  title?: string
}>()
</script>

<template>
  <img
    v-if="icon && (icon.startsWith('/') || icon.match(/^https?:/))"
    :style="{
      width: '1em',
      height: '1em',
    }"
    v-bind="$attrs"
    :src="icon"
    :alt="title"
  >
  <div
    v-else
    :style="{
      width: '1em',
      height: '1em',
    }"
    v-bind="$attrs"
    :class="icon || 'carbon-bring-forward'"
    :title="title"
  />
</template>
