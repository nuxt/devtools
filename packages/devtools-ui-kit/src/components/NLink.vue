<script setup lang="ts">
import { computed } from 'vue'

// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
// @ts-ignore tsconfig
import { NuxtLink } from '#components'

const props = defineProps<{
  to?: string
  href?: string
  target?: string
  underline?: boolean
}>()

const link = computed(() => props.href || props.to)
</script>

<template>
  <component
    :is="NuxtLink"
    v-bind="link ? {
      href: link,
      target: '_blank',
      rel: 'noopener noreferrer',
    } : {}"
    :class="{ 'n-link n-transition hover:n-link-hover n-link-base': link || underline }"
  >
    <slot />
    <div
      v-if="link && target === '_blank'"
      i-carbon:arrow-up-right translate-y--1 text-xs op50
    />
  </component>
</template>
