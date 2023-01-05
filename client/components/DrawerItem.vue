<script setup lang="ts">
import type { ModuleBuiltinTab, ModuleIframeTab } from '~~/../src/types'

defineProps<{
  tab: ModuleIframeTab | ModuleBuiltinTab
}>()
</script>

<template>
  <NuxtLink
    :to="tab.path"
    flex
    items-center
    gap2
    px3
    py2
    text-true-gray
    border="b base"
    hover="bg-gray/5"
    exact-active-class="!text-primary"
  >
    <img
      v-if="tab.icon && (tab.icon.startsWith('/') || tab.icon.match(/^https?:/))"
      w6
      :src="tab.icon"
      :alt="tab.title"
    >
    <div
      v-else
      w6
      :class="tab.icon || 'carbon-assembly-reference'"
    />
    <div>{{ tab.title }}</div>
  </NuxtLink>
</template>
