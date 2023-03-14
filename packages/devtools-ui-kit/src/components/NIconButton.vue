<script setup lang="ts">
import { NuxtLink } from '#components'

const props = defineProps<{
  to?: string
  icon: string
}>()
</script>

<template>
  <Component
    :is="to ? NuxtLink : 'button'"
    :to="to"
    v-bind="$attrs"
    class="n-transition n-icon-button"
  >
    <NIcon :icon="props.icon" />
  </Component>
</template>
