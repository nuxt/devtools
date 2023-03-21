<script setup lang="ts">
import { useVModel } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    disabled?: boolean }>(),
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
    class="items-center select-none n-disabled:n-disabled n-checkbox hover:n-checkbox-hover"
    :checked="checked || null"
    :disabled="disabled || null"
  >
    <input
      v-model="checked"
      type="checkbox"
      class="absolute op0 peer"
      :disabled="disabled"
      @keypress.enter="checked = !checked"
    >
    <span class="n-transition n-checkbox-box n-checked:n-checkbox-box-checked peer-active:n-active-base peer-focus-visible:n-focus-base">
      <NIcon class="n-transition op0 n-checkbox-icon transform scale-0 n-checked:op100 n-checked:scale-100" />
    </span>
    <span :class="checked ? '' : 'op50'" class="n-transition"><slot /></span>
  </label>
</template>
