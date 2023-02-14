<script setup lang="ts">
import type { ModuleCustomTab } from '~/../src/types'

const route = useRoute()
const name = computed(() => route.params.name)
const tabs = useTabs()
const tab = computed(() => tabs.all.value.find(i => i.name === name.value) as ModuleCustomTab)
</script>

<template>
  <template v-if="!tab">
    <div flex="~ col" h-full items-center justify-center>
      Tab not found
    </div>
  </template>
  <template v-else-if="tab.view.type === 'iframe'">
    <IframeView :tab="tab" />
  </template>
  <template v-else-if="tab.view.type === 'vnode'">
    <Component :is="tab.view.vnode" />
  </template>
  <template v-else-if="tab.view.type === 'launch'">
    <LaunchPage
      :icon="tab.view.icon || tab.icon"
      :title="tab.view.title || tab.title"
      :description="tab.view.description"
      :actions="tab.view.actions"
      @action="idx => rpc.customTabAction(tab.name, idx)"
    />
  </template>
  <template v-else>
    <div flex="~ col" h-full items-center justify-center>
      Unknown tab type {{ tab.view }}
    </div>
  </template>
</template>
