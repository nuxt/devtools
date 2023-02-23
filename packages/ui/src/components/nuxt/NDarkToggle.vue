<script setup lang="ts">
/* eslint-disable vue/no-multiple-template-root */
import { computed } from 'vue'
import { useToggle } from '@vueuse/core'
import { useColorMode } from '#imports'

const mode = useColorMode() // Auto imported from @nuxtjs/color-mode
const isDark = computed<boolean>({
  get () {
    return mode.value === 'dark'
  },
  set () {
    mode.preference = isDark.value ? 'light' : 'dark'
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
