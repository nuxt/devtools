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

const { activate, deactivate } = useFocusTrap(card, { immediate: false })

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
      class="n-transition fixed flex items-center justify-center z-100 n-dialog inset-0"
      :class="[
        show ? '' : 'op0 pointer-events-none visibility-none',
      ]"
    >
      <div
        class="inset-0 absolute -z-1"
        :class="[
          dim ? 'bg-black/50' : '',
        ]"
        @click="close()"
      />
      <NCard v-bind="$attrs" ref="card">
        <slot />
      </NCard>
    </div>
  </Teleport>
</template>
