<script setup lang="ts">
import type { ModuleIframeTab } from '~/../src/types'

const route = useRoute()
const name = $computed(() => route.params.name)
const tab = $computed(() => tabsInfoIframe.value.find(i => i.name === name) as ModuleIframeTab)
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
    <div flex="~ col gap2" h-full items-center justify-center>
      <TabIcon text-5xl :icon="tab.view.icon || tab.icon" :title="tab.title" />
      <h1 text-xl>
        {{ tab.view.title || tab.title }}
      </h1>
      <div v-if="tab.view.description" text-base op50 mt--1 mb2>
        {{ tab.view.description }}
      </div>
      <template v-for="action, idx of tab.view.actions" :key="idx">
        <NButton
          n="solid primary" :disabled="action.pending"
          @click="rpc.customTabAction(tab.name, idx)"
        >
          <NIcon v-if="action.pending" icon="carbon-circle-dash" animate-spin />
          {{ action.label }}
        </NButton>
      </template>
    </div>
  </template>
  <template v-else>
    <div flex="~ col" h-full items-center justify-center>
      Unknown tab type {{ tab.view }}
    </div>
  </template>
</template>
