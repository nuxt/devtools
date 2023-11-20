<script setup lang="ts">
import { useVModel } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    modelValue?: any
    disabled?: boolean
    options: { value: any, label: string }[]
  }>(),
  {
    modelValue: undefined,
    disabled: false,
  },
)
const emit = defineEmits<{ (...args: any): void }>()
const input = useVModel(props, 'modelValue', emit, { passive: true })
</script>

<template>
  <fieldset
    class="n-select-tabs flex flex-inline flex-wrap items-center border n-border-base rounded n-bg-base"
  >
    <label
      v-for="i, idx of options"
      :key="i.label"
      :disabled="disabled"
      class="relative n-border-base hover:n-bg-active px-0.5em py-0.1em"
      :class="[
        idx ? 'border-l n-border-base ml--1px' : '',
        i.value === input ? 'n-bg-active' : '',
      ]"
      :title="i.label"
    >
      <div
        :class="[
          i.value === input ? '' : 'op35',
        ]"
      >{{ i.label }}</div>
      <input
        v-model="input"
        type="radio"
        :disabled="disabled"
        :value="i.value"
        :title="i.label"
        class="absolute inset-0 op-0.1"
      >
    </label>
  </fieldset>
</template>
