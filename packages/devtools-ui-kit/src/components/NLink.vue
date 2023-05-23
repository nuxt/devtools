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
    class="n-link n-transition hover:n-link-hover n-link-base"
  >
    <slot />
  </Component>
</template>
