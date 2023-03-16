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
    class="n-disabled:n-disabled n-switch n-switch-base"
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
    <div class="n-transition peer-active:n-active-base peer-focus-visible:n-focus-base n-switch-slider n-checked:n-switch-slider-checked">
      <div class="n-transition n-switch-thumb n-checked:n-switch-thumb-checked" />
    </div>
    <slot />
  </label>
</template>
