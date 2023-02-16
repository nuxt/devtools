<script setup lang="ts">
import type { ModuleBuiltinTab, ModuleCustomTab } from '~/../src/types'

const props = defineProps<{
  tab: ModuleCustomTab | ModuleBuiltinTab
}>()

const client = useClient()
const isEnabled = computed(() => {
  const _tab = props.tab as ModuleBuiltinTab
  if (_tab.requireClient && !client.value)
    return false
  // Consider VS Code integration a custom tab
  if (_tab.name === 'builtin-vscode' && !devToolsSettings.value.customTabs)
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
    lg="border-b px3 py1.5 justify-start"
    hover="bg-gray/5"
    select-none
    exact-active-class="!text-primary"
  >
    <TabIcon
      text-lg lg:text-base
      :icon="tab.icon" :title="tab.title"
    />
    <div hidden lg:block flex-auto pl2>
      {{ tab.title }}
    </div>
    <div v-if="'extraTabVNode' in tab && tab.extraTabVNode" hidden lg:block>
      <Component :is="tab.extraTabVNode" />
    </div>
  </NuxtLink>
</template>
