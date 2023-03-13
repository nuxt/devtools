<script setup lang="ts">
import { onKeyDown } from '@vueuse/core'
import Fuse from 'fuse.js'
import type { AssetInfo } from '~/../src/types'

definePageMeta({
  icon: 'carbon-image-copy',
  title: 'Assets',
})

const assets = useStaticAssets()
const search = ref('')

const fuse = computed(() => new Fuse(assets.value || [], {
  keys: [
    'path',
  ],
}))

const filtered = computed(() => {
  const result = search.value
    ? fuse.value.search(search.value).map(i => i.item)
    : (assets.value || [])
  return result
})

const byFolders = computed(() => {
  const result: Record<string, AssetInfo[]> = {}
  for (const asset of filtered.value) {
    const folder = `${asset.path.split('/').slice(0, -1).join('/')}/`
    if (!result[folder])
      result[folder] = []
    result[folder].push(asset)
  }
  return Object.entries(result).sort(([a], [b]) => a.localeCompare(b))
})

const selected = ref<AssetInfo>()

const view = ref<'list' | 'grid'>('grid')

function toggleView() {
  view.value = view.value === 'list' ? 'grid' : 'list'
}

onKeyDown('Escape', () => {
  selected.value = undefined
})

const navbar = ref<HTMLElement>()
</script>

<template>
  <div h-full of-auto>
    <div ref="navbar" flex="~ col gap-2" border="b base" p4 navbar-glass flex-1 pb2>
      <div flex="~ gap4">
        <NTextInput
          v-model="search"
          placeholder="Search..."
          icon="carbon-search"
          flex-auto
          p="x5 y2"
          n="primary"
        />
        <div flex-none flex="~ gap4">
          <button
            title="Toggle view"
            @click="toggleView"
          >
            <NIcon v-if="view === 'grid'" icon="i-carbon-list" />
            <NIcon v-else icon="i-carbon-grid" />
          </button>
        </div>
      </div>
      <div op50>
        <span v-if="search">{{ filtered.length }} matched · </span>
        <span>{{ assets?.length }} assets in total</span>
      </div>
    </div>

    <template v-if="view === 'grid'">
      <template v-if="byFolders.length > 1">
        <NSectionBlock
          v-for="[folder, items] of byFolders"
          :key="folder"
          :text="folder"
          :description="`${items.length} items`"
          :open="items.length < 30"
          :padding="false"
        >
          <div px2 mt--4 grid="~ cols-minmax-8rem">
            <AssetGridItem v-for="a of items" :key="a.path" :asset="a" :folder="folder" @click="selected = a" />
          </div>
        </NSectionBlock>
      </template>
      <div v-else p2 grid="~ cols-minmax-8rem">
        <AssetGridItem v-for="a of filtered" :key="a.path" :asset="a" @click="selected = a" />
      </div>
    </template>
    <div v-else>
      <AssetListItem v-for="a of filtered" :key="a.path" :asset="a" @click="selected = a" />
    </div>
    <DrawerRight
      :model-value="!!selected"
      w-120
      auto-close
      :navbar="navbar"
      @close="selected = undefined"
    >
      <AssetDetails v-if="selected" :asset="selected" />
    </DrawerRight>
  </div>
</template>
