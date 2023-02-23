<script setup lang="ts">
import { computed } from 'vue'
import { useToggle } from '@vueuse/core'
// @ts-expect-error auto imported from @nuxtjs/color-mode
import { useColorMode } from '#imports'

const mode = useColorMode()
const isDark = computed<boolean>({
  get() {
    return mode.value === 'dark'
  },
  set() {
    mode.preference = isDark.value ? 'light' : 'dark'
  },
})
const toggle = useToggle(isDark)
const context = {
  mode,
  isDark,
  toggle,
}
</script>

<template>
  <ColorScheme tag="span">
    <slot v-bind="context" />
  </ColorScheme>
</template>
