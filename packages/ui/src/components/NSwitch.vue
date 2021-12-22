<template>
  <label
    class="n-switch n-switch-base n-disabled:n-disabled"
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
    <div class="n-transition n-switch-slider n-checked:n-switch-slider-checked peer-active:n-active-base peer-focus-visible:n-focus-base">
      <div
        class="n-transition n-switch-thumb n-checked:n-switch-thumb-checked"
      />
    </div>
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
