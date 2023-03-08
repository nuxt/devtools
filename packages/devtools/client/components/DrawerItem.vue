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
  return true
})
</script>

<template>
  <VTooltip v-if="isEnabled" placement="right">
    <NuxtLink
      :to="'path' in tab ? tab.path : `/modules/custom-${tab.name}`"
      flex="~"
      hover="bg-active"
      items-center justify-center w-10 p1 text-secondary select-none rounded-xl h-10
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
