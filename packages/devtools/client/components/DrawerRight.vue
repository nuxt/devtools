<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean
}>()
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
      border="l base"
      flex="~ col gap-1"
      p2 of-hidden navbar-glass absolute right-0 bottom-0 text-sm
      v-bind="$attrs"
    >
      <button absolute n-icon-btn text-xl right-2 top-2 @click="$emit('close')">
        <div i-carbon-close />
      </button>
      <slot />
    </div>
  </Transition>
</template>
