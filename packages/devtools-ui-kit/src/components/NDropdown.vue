<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside, useVModel } from '@vueuse/core'

const props = defineProps<{ modelValue?: boolean }>()
const emit = defineEmits<{ (...args: any): void }>()

const enabled = useVModel(props, 'modelValue', emit, { passive: true })
const el = ref<HTMLDivElement>()

onClickOutside(el, () => {
  enabled.value = false
})
</script>

<template>
  <div ref="el" class="relative">
    <slot name="trigger" :enabled="enabled" @click="enabled = !enabled">
      <NButton @click="enabled = !enabled">
        Dropdown
      </NButton>
    </slot>

    <div
      class="absolute n-transition n-bg-base rounded border z-10 n-border-base shadow"
      :class="[enabled ? 'op-100' : 'op0 pointer-events-none -translate-y-1']"
    >
      <slot />
    </div>
  </div>
</template>
