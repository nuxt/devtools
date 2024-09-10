<script setup lang="ts">
import { onClickOutside, useElementSize } from '@vueuse/core'
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  top?: HTMLElement | string
  left?: HTMLElement | string
  autoClose?: boolean
  transition?: 'right' | 'bottom' | 'top'
}>(), {
  transition: 'right',
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const el = ref<HTMLElement>()

const { height } = useElementSize(() => props.top as HTMLElement, undefined, { box: 'border-box' })

const width = typeof props.left === 'string' && props.left.startsWith('#')
  ? document.querySelector(props.left)?.getBoundingClientRect().width
  : useElementSize(() => props.left as HTMLElement, undefined, { box: 'border-box' }).width

onClickOutside(el, () => {
  if (props.modelValue && props.autoClose)
    emit('close')
}, {
  ignore: ['a', 'button', 'summary', '[role="dialog"]'],
})

const transitionType = {
  right: {
    'enter-from-class': 'transform translate-x-1/1',
    'leave-to-class': 'transform translate-x-1/1',
  },
  top: {
    'enter-from-class': 'transform translate-y--1/1',
    'leave-to-class': 'transform translate-y--1/1',
  },
  bottom: {
    'enter-from-class': 'transform translate-y-1/1',
    'leave-to-class': 'transform translate-y-1/1',
  },
}
</script>

<template>
  <Transition
    v-bind="transitionType[transition]"
    enter-active-class="duration-200 ease-in"
    enter-to-class="opacity-100"
    leave-active-class="duration-200 ease-out"
    leave-from-class="opacity-100"
  >
    <div
      v-if="modelValue"
      ref="el"
      :border="`${transition === 'right' ? 'l' : transition === 'bottom' ? 't' : 'b'} base`"
      flex="~ col gap-1"
      :class="{ 'right-0': transition === 'right' || transition === 'bottom' }"
      absolute bottom-0 z-10 z-20 of-auto text-sm n-glass-effect
      :style="{
        top: transition === 'bottom' ? 'auto' : `${height}px`,
        left: transition === 'right' && !width ? 'auto' : `${width}px`,
      }"
      v-bind="$attrs"
    >
      <NButton absolute right-2 top-2 z-20 text-xl icon="carbon-close" :border="false" @click="$emit('close')" />
      <div relative h-full w-full of-auto>
        <slot />
      </div>
    </div>
  </Transition>
</template>
