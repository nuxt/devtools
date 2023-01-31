
<script setup lang="ts">
import { NuxtLink } from '#components'

defineProps<{
  to?: string
  href?: string
  target?: string
}>()
</script>

<template>
  <Component
    :is="(href || target) ? 'a' : NuxtLink"
    v-bind="$props"
    class="n-link n-link-base hover:n-link-hover n-transition"
  >
    <slot />
  </Component>
</template>
