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
  <button relative flex="~ col gap-1" hover="bg-active" items-center of-hidden rounded p2>
    <NIcon v-if="asset.layer" icon="i-carbon-layers" absolute right-4 top-4 bg-primary />
    <AssetPreview h-30 w-30 rounded border="~ base" :asset="asset" />
    <div w-full of-hidden truncate ws-nowrap text-center text-xs>
      {{ path }}
    </div>
  </button>
</template>
