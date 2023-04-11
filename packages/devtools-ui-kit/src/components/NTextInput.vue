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
  <div class="n-text-input flex flex items-center border n-border-base rounded py-1 pl-1 pr-2 focus-within:n-focus-base focus-within:border-context n-bg-base">
    <slot name="icon">
      <NIcon v-if="icon" :icon="icon" class="ml-0.3em mr-0.1em text-1.1em op50" />
    </slot>
    <input
      v-model="input"
      class="ml-0.4em w-full flex-auto n-bg-base !outline-none"
      :type="type"
      :disabled="disabled"
      :placeholder="placeholder"
    >
  </div>
</template>
