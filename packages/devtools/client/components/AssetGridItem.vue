<script setup lang="ts">
import type { AssetInfo } from '~/../src/types'

const props = defineProps<{
  asset: AssetInfo
  folder?: string
}>()

const path = computed(() => {
  if (props.folder && props.asset.path.startsWith(props.folder))
    return props.asset.path.slice(props.folder.length)
  return props.asset.path
})
</script>

<template>
  <button flex="~ col gap-1" hover="bg-active" items-center of-hidden rounded p2>
    <AssetPreview h-30 w-30 rounded border="~ base" :asset="asset" />
    <div w-full of-hidden truncate ws-nowrap text-center text-xs>
      {{ path }}
    </div>
  </button>
</template>
