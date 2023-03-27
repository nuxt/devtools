<script setup lang="ts">
import type { AssetInfo } from '~/../src/types'

defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select'])
const selectAsset = (asset: AssetInfo) => emit('select', asset)
</script>

<template>
  <div m-2>
    <div flex>
      <NIcon icon="carbon-folder" />
      <span ml-2>
        {{ item.name }}
      </span>
    </div>
    <div ml-6>
      <AssetListItem v-for="a of item.assets" :key="a.path" :asset="a" @click="selectAsset(a)" />
    </div>
    <AssetListFolder v-for="folder in item.folders" :key="folder.path" :item="folder" ml-10 @select="selectAsset" />
  </div>
</template>
