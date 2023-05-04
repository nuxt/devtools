<script setup lang="ts">
import { useVModel } from '@vueuse/core'

const props = defineProps<{
  tabs: string[]
  modelValue: string
}>()

const emit = defineEmits<{ (...args: any): void }>()
const activeTab = useVModel(props, 'modelValue', emit, { passive: true })
</script>

<template>
  <div flex="~ wrap" w-full>
    <button
      v-for="tab, idx of tabs" :key="idx"
      px4 py2 border="r base"
      hover="bg-active"
      :class="activeTab === tab ? '' : 'border-b'"
      @click="activeTab = tab"
    >
      <div :class="activeTab === tab ? '' : 'op30' " font-mono>
        {{ tab }}
      </div>
    </button>
  </div>
  <div px4 py2 flex="~ col gap-2" border="b base">
    <slot />
  </div>
</template>
