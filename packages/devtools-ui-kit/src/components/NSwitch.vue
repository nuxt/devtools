<script setup lang="ts">
import { useVModel } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
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
    class="n-switch n-switch-base hover:n-switch-hover n-disabled:n-disabled"
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
    <div class="n-switch-slider n-checked:n-switch-slider-checked peer-active:n-active-base peer-focus-visible:n-focus-base n-transition">
      <div class="n-checked:n-switch-thumb-checked n-switch-thumb n-transition" />
    </div>
    <slot />
  </label>
</template>
