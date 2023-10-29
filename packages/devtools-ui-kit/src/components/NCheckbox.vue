<script setup lang="ts">
import { useVModel } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean | null
    disabled?: boolean
  }>(),
  {
    modelValue: false,
    disabled: false,
  },
)
const emit = defineEmits<{ (...args: any): void }>()
const checked = useVModel(props, 'modelValue', emit, { passive: true })
</script>

<template>
  <label
    class="n-checkbox hover:n-checkbox-hover select-none items-center n-disabled:n-disabled"
    :checked="checked || null"
    :disabled="disabled || null"
  >
    <input
      v-model="checked"
      type="checkbox"
      class="peer absolute op0"
      :disabled="disabled"
      @keypress.enter="checked = !checked"
    >
    <span class="n-checkbox-box n-checked:n-checkbox-box-checked peer-active:n-active-base peer-focus-visible:n-focus-base n-transition">
      <NIcon class="n-checkbox-icon scale-0 transform op0 n-transition n-checked:scale-100 n-checked:op100" />
    </span>
    <span :class="checked ? '' : 'op50'" class="n-transition"><slot /></span>
  </label>
</template>
