<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
// @ts-ignore tsconfig
import { NuxtLink } from '#components'

defineProps<{
  to?: string
  icon?: string
}>()
</script>

<template>
  <Component
    :is="to ? NuxtLink : 'button'"
    :to="to"
    v-bind="$attrs"
    class="n-button n-button-base active:n-button-active focus-visible:n-focus-base n-transition hover:n-button-hover n-disabled:n-disabled"
  >
    <slot name="icon">
      <NIcon v-if="icon" :icon="icon" class="n-button-icon" />
    </slot>
    <slot />
  </Component>
</template>
