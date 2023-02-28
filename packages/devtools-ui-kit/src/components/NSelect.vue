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
    class="n-bg-base rounded py-1 border n-border-base flex items-center flex n-text-input focus-within:n-focus-base focus-within:border-context px-2"
  >
    <slot name="icon">
      <NIcon v-if="icon" :icon="icon" class="op50 mr-0.4em text-1.1em" />
    </slot>
    <select v-model="input" :disabled="disabled" class="flex-auto n-bg-base w-full !outline-none">
      <option v-if="placeholder" value="" disabled hidden>
        {{ placeholder }}
      </option>
      <slot />
    </select>
  </div>
</template>
