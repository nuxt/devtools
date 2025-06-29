<script setup lang="ts">
withDefaults(
  defineProps<{
    disabled?: boolean
  }>(),
  {
    disabled: false,
  },
)
const checked = defineModel('modelValue', {
  type: Boolean,
  default: false,
})
</script>

<template>
  <label
    class="n-switch n-switch-base hover:n-switch-hover n-disabled:n-disabled"
    :checked="checked || null"
    :disabled="disabled || null"
  >
    <input
      v-model="checked"
      type="checkbox"
      class="peer absolute op0"
      :disabled="disabled"
      @keypress.enter="checked = !checked"
    >
    <div class="n-switch-slider n-transition n-checked:n-switch-slider-checked peer-active:n-active-base peer-focus-visible:n-focus-base">
      <div class="n-switch-thumb n-transition n-checked:n-switch-thumb-checked" />
    </div>
    <slot />
  </label>
</template>
