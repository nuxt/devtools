<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { getIconifySvg } from '../../../devtools-ui-kit/src/composables/iconify'

const props = withDefaults(defineProps<{
  icon?: string
  title?: string
  showTitle?: boolean
}>(), {
  showTitle: true,
})

const svg = ref<string | undefined>()

watchEffect(async () => {
  svg.value = props.icon ? await getIconifySvg(props.icon) : undefined
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
    v-else-if="svg"
    :style="{
      width: '1em',
      height: '1em',
    }"
    v-bind="$attrs"
    :title="showTitle ? title : undefined"
    v-html="svg"
  />
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
