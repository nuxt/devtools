<script setup lang="ts">
import { computed, nextTick, ref, watchEffect } from 'vue'
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
const shown = ref(false)

const { activate, deactivate } = useFocusTrap(computed(() => card.value || document.body), { immediate: false })

watchEffect(
  () => {
    if (!shown.value && show.value)
      shown.value = true

    if (show.value && card.value)
      nextTick(activate)
    else
      deactivate()
  },
)

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
  <Teleport v-if="shown" to="body">
    <div
      v-show="show"
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
