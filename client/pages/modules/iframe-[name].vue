<script setup lang="ts">
import type { ModuleIframeTab } from '~/../src/types'
const route = useRoute()

const name = $computed(() => route.params.name)
const tab = $computed(() => tabsInfoIframe.find(i => i.name === name) as ModuleIframeTab)
</script>

<template>
  <IframeView v-if="tab" :tab="tab" />
</template>
