<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { getIconifySvg } from '../composables/iconify'

const props = defineProps<{
  icon?: string
}>()

const svg = ref<string | undefined>()

watchEffect(async () => {
  svg.value = props.icon ? await getIconifySvg(props.icon) : undefined
})
</script>

<template>
  <div
    v-if="svg"
    class="n-icon"
    inline-block align-middle
    v-html="svg"
  />
  <div v-else class="n-icon" :class="icon" />
</template>
