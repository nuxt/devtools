<script setup lang="ts">
import { useVModel } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    modelValue?: any
    placeholder?: string
    icon?: string
    disabled?: boolean
  }>(),
  {
    modelValue: undefined,
    placeholder: '',
    disabled: false,
    icon: '',
  },
)
const emit = defineEmits<{ (...args: any): void }>()
const input = useVModel(props, 'modelValue', emit, { passive: true })
</script>

<template>
  <div
    class="n-select flex flex items-center border rounded px-2 py-1 focus-within:n-focus-base focus-within:border-context n-bg-base"
    :class="disabled ? 'border-gray:10' : 'n-border-base'"
  >
    <slot name="icon">
      <NIcon v-if="icon" :icon="icon" class="mr-0.4em text-1.1em op50" />
    </slot>
    <select v-model="input" :disabled="disabled" class="w-full flex-auto n-bg-base !outline-none" :class="disabled ? 'appearance-none' : ''">
      <option v-if="placeholder" value="" disabled hidden>
        {{ placeholder }}
      </option>
      <slot />
    </select>
  </div>
</template>
