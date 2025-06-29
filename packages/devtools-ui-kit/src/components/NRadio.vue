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
    class="n-radio inline-flex select-none items-center hover:n-radio-hover n-disabled:n-disabled"
    :checked="model === value || null"
    :disabled="disabled || null"
  >
    <input
      v-model="model"
      type="radio"
      class="peer absolute op0"
      :disabled="disabled"
      :name="name"
      :value="value"
      @keypress.enter="model = value!"
    >
    <span class="n-radio-box n-transition n-checked:n-radio-box-checked peer-active:n-active-base peer-focus-visible:n-focus-base">
      <div class="n-radio-inner n-transition n-checked:n-radio-inner-checked" />
    </span>
    <span><slot /></span>
  </label>
</template>
