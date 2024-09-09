<script setup lang="ts">
import { onClickOutside, useVModel } from '@vueuse/core'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import { computed, nextTick, ref, watchEffect } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    dim?: boolean
    autoClose?: boolean
  }>(),
  {
    modelValue: false,
    dim: true,
    autoClose: true,
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

onClickOutside(card, () => {
  if (props.modelValue && props.autoClose) {
    show.value = false
    emit('close')
  }
}, {
  ignore: ['a', 'button', 'summary'],
})
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
      class="fixed inset-0 z-100 flex items-center justify-center n-transition n-glass-effect"
      role="dialog"
      aria-modal="true"
      :class="[
        show ? '' : 'op0 pointer-events-none visibility-none',
      ]"
    >
      <div
        class="absolute inset-0 -z-1"
        :class="[
          dim ? 'glass-effect' : '',
        ]"
      />
      <NCard v-bind="$attrs" ref="card" class="max-h-screen of-auto">
        <slot />
      </NCard>
    </div>
  </Teleport>
</template>
