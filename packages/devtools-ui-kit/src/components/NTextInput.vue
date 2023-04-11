<script setup lang="ts">
import { useVModel } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    placeholder?: string
    icon?: string
    disabled?: boolean
    type?: string
  }>(),
  {
    modelValue: '',
    disabled: false,
    type: 'text',
  },
)
const emit = defineEmits<{ (...args: any): void }>()
const input = useVModel(props, 'modelValue', emit, { passive: true })
</script>

<template>
  <div class="n-text-input flex flex items-center border n-border-base rounded px-2 py-1 focus-within:n-focus-base focus-within:border-context n-bg-base">
    <slot name="icon">
      <NIcon v-if="icon" :icon="icon" class="mr-0.4em text-1.1em op50" />
    </slot>
    <input
      v-model="input"
      class="w-full flex-auto n-bg-base !outline-none"
      :type="type"
      :disabled="disabled"
      :placeholder="placeholder"
    >
  </div>
</template>
