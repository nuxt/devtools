<script setup lang="ts">
import { useVModel } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    disabled?: boolean
    name?: string
    value?: string
  }>(),
  {
    modelValue: '',
    disabled: false,
  },
)
const emit = defineEmits<{ (...args: any): void }>()
const model = useVModel(props, 'modelValue', emit, { passive: true })
</script>

<template>
  <label
    class="n-disabled:n-disabled inline-flex items-center select-none n-radio hover:n-radio-hover"
    :checked="model === value || null"
    :disabled="disabled || null"
  >
    <input
      v-model="model"
      type="radio"
      class="absolute op0 peer"
      :disabled="disabled"
      :name="name"
      :value="value"
      @keypress.enter="model = value!"
    >
    <span class="n-transition peer-active:n-active-base peer-focus-visible:n-focus-base n-radio-box n-checked:n-radio-box-checked">
      <div class="n-transition n-radio-inner n-checked:n-radio-inner-checked" />
    </span>
    <span><slot /></span>
  </label>
</template>
