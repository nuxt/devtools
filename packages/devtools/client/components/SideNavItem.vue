<script setup lang="ts">
import type { ModuleBuiltinTab, ModuleCustomTab } from '~/../src/types'

const props = withDefaults(
  defineProps<{
    tab: ModuleCustomTab | ModuleBuiltinTab
    minimized?: boolean
    target?: 'main' | 'side'
  }>(),
  {
    minimized: true,
    target: 'main',
  },
)
</script>

<template>
  <VTooltip v-if="minimized" placement="right">
    <SideNavItemBase v-bind="props" />
    <template #popper>
      <div>
        {{ tab.title }}
      </div>
      <div v-if="'extraTabVNode' in tab && tab.extraTabVNode" hidden lg:block>
        <Component :is="tab.extraTabVNode" />
      </div>
    </template>
  </VTooltip>
  <SideNavItemBase v-else v-bind="props" />
</template>
