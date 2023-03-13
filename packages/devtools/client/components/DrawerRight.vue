<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean
  navbar?: HTMLElement
  autoClose?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const el = ref<HTMLElement>()

const { height: top } = useElementSize(() => props.navbar, undefined, { box: 'border-box' })

onClickOutside(el, () => {
  if (props.modelValue && props.autoClose)
    emit('close')
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
  <Transition
    enter-active-class="duration-200 ease-in"
    enter-from-class="transform translate-x-1/1"
    enter-to-class="opacity-100"
    leave-active-class="duration-200 ease-out"
    leave-from-class="opacity-100"
    leave-to-class="transform translate-x-1/1"
  >
    <div
      v-if="modelValue"
      ref="el"
      border="l base"
      flex="~ col gap-1"
      text-sm absolute of-auto right-0 bottom-0 glass-effect z-10 z-20
      :style="{ top: `${top}px` }"
      v-bind="$attrs"
    >
      <NIconButton absolute z-20 text-xl right-2 top-2 icon="carbon-close" @click="$emit('close')" />
      <div w-full of-auto h-full relative>
        <slot />
      </div>
    </div>
  </Transition>
</template>
