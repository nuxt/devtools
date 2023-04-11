<script setup lang="ts">
import type { AssetInfo } from '~/../src/types'

defineProps<{
  asset: AssetInfo
  textContent?: string
}>()
</script>

<template>
  <div flex items-center justify-center of-hidden bg-active object-cover p1>
    <template v-if="asset.type === 'image'">
      <img :src="asset.publicPath">
    </template>
    <AssetFontPreview
      v-else-if="asset.type === 'font'"
      :key="asset.publicPath"
      :asset="asset" self-stretch p2 text-2xl
    />
    <div v-else-if="asset.type === 'text' && !textContent" i-carbon-document text-3xl op20 />
    <div v-else-if="asset.type === 'text' && textContent" w-full self-start p4>
      <pre max-h-10rem of-hidden font-mono text-xs v-text="textContent" />
    </div>
    <div v-else i-carbon-help text-3xl op20 />
  </div>
</template>
