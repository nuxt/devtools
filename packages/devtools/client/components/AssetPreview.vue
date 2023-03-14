<script setup lang="ts">
import type { AssetInfo } from '~/../src/types'

defineProps<{
  asset: AssetInfo
  textContent?: string
}>()
</script>

<template>
  <div items-center of-hidden justify-center flex p1 bg-active object-cover>
    <template v-if="asset.type === 'image'">
      <img :src="asset.publicPath">
    </template>
    <AssetFontPreview v-else-if="asset.type === 'font'" :key="asset.publicPath" :asset="asset" p2 self-stretch text-2xl />
    <div v-else-if="asset.type === 'text' && !textContent" op20 text-3xl i-carbon-document />
    <div v-else-if="asset.type === 'text' && textContent" w-full p4 self-start>
      <pre of-hidden text-xs font-mono max-h-10rem v-text="textContent" />
    </div>
    <div v-else op20 text-3xl i-carbon-help />
  </div>
</template>
