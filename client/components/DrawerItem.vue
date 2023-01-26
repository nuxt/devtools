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
    :to="'path' in tab ? tab.path : `/modules/custom-${tab.name}`"
    flex="~" p2
    items-center justify-center
    text-true-gray
    border="base"
    md="border-b px3 py2 justify-start"
    hover="bg-gray/5"
    exact-active-class="!text-primary"
  >
    <TabIcon
      text-lg lg:text-base
      :icon="tab.icon" :title="tab.title"
    />
    <div pl2 hidden lg:block>
      {{ tab.title }}
    </div>
  </NuxtLink>
</template>
