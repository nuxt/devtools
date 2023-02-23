<template>
  <label
    class="n-checkbox inline-flex items-center select-none hover:n-checkbox-hover n-disabled:n-disabled"
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
      <NIcon class="n-transition n-checkbox-icon transform scale-0 op0 n-checked:op100 n-checked:scale-100" />
    </span>
    <span><slot /></span>
  </label>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    disabled?: boolean }>(),
  {
    modelValue: false,
    disabled: false
  }
)
const emit = defineEmits<{(...args: any): void}>()
const checked = useVModel(props, 'modelValue', emit, { passive: true })
</script>
