<script setup lang="ts">
import type { CategorizedTabs } from '../../src/types'

defineProps<{
  categories: CategorizedTabs
  target: 'main' | 'side'
}>()
</script>

<template>
  <div flex="~ col gap-1" max-w-80 py1>
    <template v-for="[name, tabs], idx of categories" :key="name">
      <template v-if="tabs.length">
        <div v-if="idx" h-1px border="b base" />
        <div flex="~ wrap" px1>
          <SideNavItem
            v-for="tab of tabs"
            :key="tab.name"
            :target="target"
            :tab="tab"
          />
        </div>
      </template>
    </template>
  </div>
</template>
