<script setup lang="ts">
import NLink from './NLink.vue'

defineProps<{
  link?: string
}>()
</script>

<template>
  <component
    :is="link ? NLink : 'div'"
    v-bind="link ? {
      href: link,
      target: '_blank',
      rel: 'noopener noreferrer',
    } : {}"
  >
    <slot />
    <div
      v-if="link"
      i-carbon:arrow-up-right translate-y--1 text-xs op50
    />
  </component>
</template>
