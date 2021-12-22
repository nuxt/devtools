<template>
  <Component
    :is="(href || target) ? 'a' : 'nuxt-link'"
    v-bind="$props"
    class="n-link n-link-base hover:n-link-hover n-transition"
  >
    <slot />
  </Component>
</template>

<script setup lang="ts">
defineProps<{
  to?: string
  href?: string
  target?: string
}>()
</script>
