<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  to?: string
  href?: string
  target?: string
  underline?: boolean
}>()

const link = computed(() => props.href || props.to)
</script>

<template>
  <NuxtLink
    v-bind="link ? {
      href: link,
      target,
      rel: target === '_blank' ? 'noopener noreferrer' : null,
    } : {}"
    :class="{ 'n-link n-transition hover:n-link-hover n-link-base': link || underline }"
  >
    <slot />
    <div
      v-if="link && target === '_blank'"
      i-carbon:arrow-up-right translate-y--1 text-xs op50
    />
  </NuxtLink>
</template>
