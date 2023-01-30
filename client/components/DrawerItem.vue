<script setup lang="ts">
import type { ModuleBuiltinTab, ModuleCustomTab } from '~/../src/types'

const { tab } = defineProps<{
  tab: ModuleCustomTab | ModuleBuiltinTab
}>()

const client = useClient()
const isEnabled = computed(() => {
  const _tab = tab as ModuleBuiltinTab
  if (_tab.requireClient && !client.value)
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
    lg="border-b px3 py2 justify-start"
    hover="bg-gray/5"
    exact-active-class="!text-primary"
  >
    <TabIcon
      text-lg lg:text-base
      :icon="tab.icon" :title="tab.title"
    />
    <div pl2 hidden lg:block flex-auto>
      {{ tab.title }}
    </div>
    <div v-if="'extraTabVNode' in tab && tab.extraTabVNode" hidden lg:block>
      <Component :is="tab.extraTabVNode" />
    </div>
  </NuxtLink>
</template>
