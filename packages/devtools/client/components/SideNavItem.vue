<script setup lang="ts">
import type { ModuleBuiltinTab, ModuleCustomTab } from '~/../src/types'

const props = defineProps<{
  tab: ModuleCustomTab | ModuleBuiltinTab
}>()

const settings = useDevToolsSettings()
const client = useClient()
const isEnabled = computed(() => {
  const _tab = props.tab as ModuleBuiltinTab
  if (_tab.shouldShow && !_tab.shouldShow())
    return false
  if (_tab.requireClient && !client.value)
    return false
  if (settings.hiddenTabs.value.includes(_tab.name))
    return false
  return true
})
</script>

<template>
  <VTooltip v-if="isEnabled" placement="right">
    <NuxtLink
      :to="'path' in tab ? tab.path : `/modules/custom-${tab.name}`"
      flex="~"
      hover="bg-active"
      select-none items-center justify-center p1 w-10 text-secondary rounded-xl h-10
      exact-active-class="!text-primary bg-active"
    >
      <TabIcon
        text-xl
        :icon="tab.icon" :title="tab.title"
      />
    </NuxtLink>
    <template #popper>
      <div>
        {{ tab.title }}
      </div>
      <div v-if="'extraTabVNode' in tab && tab.extraTabVNode" hidden lg:block>
        <Component :is="tab.extraTabVNode" />
      </div>
    </template>
  </VTooltip>
</template>
