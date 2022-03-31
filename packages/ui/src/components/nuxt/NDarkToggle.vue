<script setup lang="ts">
/* eslint-disable vue/no-multiple-template-root */
import { useToggle } from '@vueuse/core'

const mode = useColorMode() // Auto imported from @nuxtjs/color-mode
const isDark = computed<boolean>({
  get () {
    return mode.value === 'dark'
  },
  set (v) {
    mode.preference = v ? 'dark' : 'light'
  }
})
const toggle = useToggle(isDark)
const context = {
  mode,
  isDark,
  toggle
}
</script>

<template>
  <ColorScheme tag="span">
    <slot v-bind="context" />
  </ColorScheme>
</template>
