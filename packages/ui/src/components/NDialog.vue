<template>
  <div
    class="n-dialog n-transition fixed inset-0 flex items-center justify-center z-100"
    :class="[
      show ? '' : 'op0 pointer-events-none',
    ]"
  >
    <div
      class="absolute inset-0 -z-1"
      :class="[
        dim ? 'bg-black/50' : ''
      ]"
      @click="close"
    />
    <NCard v-bind="$attrs" ref="card">
      <slot />
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useVModel } from '@vueuse/core'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    dim?: boolean
  }>(),
  {
    modelValue: false,
    dim: true
  }
)
const emit = defineEmits<{(...args: any): void }>()

const show = useVModel(props, 'modelValue', emit, { passive: true })
const card = ref(null)

const { activate, deactivate } = useFocusTrap(card, { immediate: false })

onMounted(() => {
  watch(show, (v) => {
    if (v) { activate() } else { deactivate() }
  }, { immediate: true })
})

function close () {
  show.value = false
  emit('close')
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>
