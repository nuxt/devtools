<script setup lang="ts">
import type { AssetInfo } from '~/../src/types'

const props = defineProps<{
  asset: AssetInfo
}>()
</script>

<template>
  <div flex items-center of-hidden justify-center p1 bg-active object-cover>
    <template v-if="asset.type === 'image'">
      <img :src="asset.publicPath">
    </template>
    <AssetFontPreview v-else-if="asset.type === 'font'" :key="asset.publicPath" :asset="asset" p2 self-stretch text-2xl />
    <div v-else-if="asset.type === 'json'" op20 text-3xl i-carbon-json />
    <div v-else op20 text-3xl i-carbon-help />
  </div>
</template>
