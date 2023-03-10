<script setup lang="ts">
import type { AssetInfo } from '~/../src/types'

const props = defineProps<{
  asset: AssetInfo
}>()

const icon = computed(() => {
  if (props.asset.type === 'image')
    return 'i-carbon-image'
  if (props.asset.type === 'video')
    return 'i-carbon-video'
  if (props.asset.type === 'audio')
    return 'i-carbon-volume-up'
  if (props.asset.type === 'font')
    return 'i-carbon-text-small-caps'
  if (props.asset.type === 'text')
    return 'i-carbon-document'
  if (props.asset.type === 'json')
    return 'i-carbon-json'
  return 'i-carbon-document-blank'
})
</script>

<template>
  <button flex="~ gap-1" w-full items-center hover="bg-active" rounded px4 py2>
    <div :class="icon" />
    <div text-center ws-nowrap of-hidden truncate>
      {{ asset.path }}
    </div>
  </button>
</template>
