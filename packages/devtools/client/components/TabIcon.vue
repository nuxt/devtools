<script setup lang="ts">
withDefaults(defineProps<{
  icon?: string
  title?: string
  showTitle?: boolean
}>(), {
  showTitle: true,
})
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
    :title="showTitle ? title : undefined"
  />
</template>
