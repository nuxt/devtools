<script setup lang="ts">
import type { ModuleBuiltinTab, ModuleIframeTab } from '~~/../src/types'

const { tab } = defineProps<{
  tab: ModuleIframeTab | ModuleBuiltinTab
}>()

const client = $(useClient())
const config = $(useServerConfig())
const isEnabled = computed(() => {
  const _tab = tab as ModuleBuiltinTab
  if (_tab.requireClient && !client)
    return false
  if (_tab.requirePages && !config?.pages)
    return false
  return true
})
</script>

<template>
  <NuxtLink
    v-if="isEnabled"
    :to="tab.path"
    flex="~ gap2"
    items-center
    p2
    text-true-gray
    border="base"
    md="border-b px3 py2"
    hover="bg-gray/5"
    exact-active-class="!text-primary"
  >
    <img
      v-if="tab.icon && (tab.icon.startsWith('/') || tab.icon.match(/^https?:/))"
      w10 md:w6
      :src="tab.icon"
      :alt="tab.title"
    >
    <div
      v-else
      w10 md:w6
      :class="tab.icon || 'carbon-bring-forward'"
    />
    <div hidden md:block>
      {{ tab.title }}
    </div>
  </NuxtLink>
</template>
