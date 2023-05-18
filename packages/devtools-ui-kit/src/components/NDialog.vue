<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useVModel } from '@vueuse/core'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    dim?: boolean
  }>(),
  {
    modelValue: false,
    dim: true,
  },
)
const emit = defineEmits<{
  (event: 'close'): void
  (event: 'update:modelValue', value: boolean): void
}>()

const show = useVModel(props, 'modelValue', emit, { passive: true })
const card = ref(null)

const { activate, deactivate } = useFocusTrap(card.value, { immediate: false })

onMounted(() => {
  watch(show, (v) => {
    if (v)
      activate()
    else
      deactivate()
  }, { immediate: true })
})

function close() {
  show.value = false
  emit('close')
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <Teleport v-if="show" to="body">
    <div
      class="n-dialog fixed inset-0 z-100 flex items-center justify-center n-transition"
      :class="[
        show ? '' : 'op0 pointer-events-none visibility-none',
      ]"
    >
      <div
        class="absolute inset-0 -z-1"
        :class="[
          dim ? 'bg-black/50' : '',
        ]"
        @click="close()"
      />
      <NCard v-bind="$attrs" ref="card" class="max-h-screen of-auto">
        <slot />
      </NCard>
    </div>
  </Teleport>
</template>
