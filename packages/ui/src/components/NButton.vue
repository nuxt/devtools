<template>
  <Component
    :is="to ? 'a' : 'button'"
    :href="to"
    class="n-button n-transition n-button-base hover:n-button-hover active:n-button-active focus-visible:n-focus-base n-disabled:n-disabled"
  >
    <slot name="icon">
      <NIcon v-if="icon" :icon="icon" class="n-button-icon" />
    </slot>
    <slot />
  </Component>
</template>

<script setup lang="ts">
defineProps<{
  to?: string
  icon?: string
}>()
</script>
