<script setup lang="ts">
import type { AssetInfo } from '~/../src/types'

defineProps<{
  asset: AssetInfo
}>()
</script>

<template>
  <div flex items-center of-hidden p1 justify-center bg-active>
    <template v-if="asset.type === 'image'">
      <img :src="asset.publicPath" max-w-full max-h-full>
    </template>
    <div v-else-if="asset.type === 'json'" op20 text-3xl i-carbon-json />
    <div v-else-if="asset.type === 'font'" op20 text-3xl i-carbon-text-small-caps />
    <div v-else op20 text-3xl i-carbon-help />
  </div>
</template>
