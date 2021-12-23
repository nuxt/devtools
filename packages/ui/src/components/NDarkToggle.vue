<script setup lang="ts">
/* eslint-disable vue/no-multiple-template-root */
import { useColorMode, useToggle } from '@vueuse/core'
import { computed } from 'vue'

const mode = useColorMode()

const isDark = computed<boolean>({
  get () {
    return mode.value === 'dark'
  },
  set (v) {
    mode.value = v ? 'dark' : 'light'
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
  <slot v-bind="context" />
</template>
