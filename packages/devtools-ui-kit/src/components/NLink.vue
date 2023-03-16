<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
// @ts-ignore tsconfig
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
    class="n-transition n-link n-link-base hover:n-link-hover"
  >
    <slot />
  </Component>
</template>
