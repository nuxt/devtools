<script setup lang="ts">
import type { ModuleIframeTab } from '~/../src/types'
const route = useRoute()

const name = $computed(() => route.params.name)
const tab = $computed(() => tabsInfoIframe.value.find(i => i.name === name) as ModuleIframeTab)

const loadingState = $computed(() => tab._loadState || 'loaded')

function start() {
  return rpc.startCustomTab(tab.name)
}
</script>

<template>
  <template v-if="!tab">
    <div flex="~ col" h-full items-center justify-center>
      Tab not found
    </div>
  </template>
  <template v-else-if="loadingState === 'loaded'">
    <IframeView :tab="tab" />
  </template>
  <template v-else>
    <div flex="~ col gap2" h-full items-center justify-center>
      <TabIcon text-5xl :icon="tab.icon" :title="tab.title" />
      <h1 text-xl>
        {{ tab.title }}
      </h1>
      <div v-if="tab.lazy?.description" text-base op50 mt--1 mb2>
        {{ tab.lazy?.description }}
      </div>
      <NButton n="solid primary" :disabled="loadingState !== 'idle'" @click="start()">
        <template v-if="loadingState === 'idle'">
          Start
        </template>
        <template v-else>
          <NIcon icon="carbon-circle-dash" animate-spin />
          Starting...
        </template>
      </NButton>
    </div>
  </template>
</template>
