<script setup lang="ts">
import { computed } from 'vue'
import { getHslColorFromStringHash } from '../composables/color'
import NBadge from './NBadge.vue'

const props = defineProps<{
  text: string
}>()

const color = computed(() => {
  const foreground = getHslColorFromStringHash(props.text, 50, 60)
  const background = getHslColorFromStringHash(props.text, 50, 60, 0.1)
  return { color: foreground, background }
})
</script>

<template>
  <NBadge :style="color">
    {{ text }}<slot />
  </NBadge>
</template>
