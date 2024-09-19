<script setup lang="ts">
import type { AssetInfo } from '~/../src/types'
import { onKeyDown } from '@vueuse/core'
import Fuse from 'fuse.js'

definePageMeta({
  icon: 'carbon-image-copy',
  title: 'Assets',
  layout: 'full',
})

const assets = useStaticAssets()
const dropzone = ref(false)
const search = ref('')

const fuse = computed(() => new Fuse(assets.value || [], {
  keys: [
    'path',
  ],
}))

const extensions = reactiveComputed(() => {
  const results: { name: string, value: boolean }[] = []
  for (const asset of assets.value || []) {
    const ext = asset.path.split('.').pop()
    if (ext && !results.find(e => e.name === ext))
      results.push({ name: ext, value: true })
  }
  return results
})

const filtered = computed(() => {
  const result = search.value
    ? fuse.value.search(search.value).map(i => i.item)
    : (assets.value || [])
  return result.filter((asset) => {
    const ext = asset.path.split('.').pop()
    return !ext || extensions.some(e => e.name === ext && e.value)
  })
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

const byTree = computed(() => {
  const root = { path: 'public', children: [] }

  const addToTree = (node: any, pathParts: any, file: AssetInfo) => {
    const [currentPart, ...remainingParts] = pathParts

    let child = node.children.find((child: any) => child.path === currentPart)
    if (!child) {
      child = { ...file, path: currentPart, children: [] }
      node.children.push(child)
    }

    if (remainingParts.length > 1)
      addToTree(child, remainingParts, file)
    else if (remainingParts.length === 1)
      child.children.push({ ...file, path: remainingParts[0] })
  }

  filtered.value.forEach((file) => {
    const pathParts = file.path.split('/').filter(part => part !== '')
    addToTree(root, pathParts, file)
  })

  return root.children
})

const selected = ref<AssetInfo>()

const { view } = useDevToolsOptions('assets')

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
    <NNavbar ref="navbar" v-model:search="search" pb2>
      <template #actions>
        <div flex-none flex="~ gap2 items-center" text-lg>
          <NButton
            v-tooltip.bottom-end="'File Upload'"
            icon="carbon:cloud-upload"
            title="File Upload" :border="false"
            @click="dropzone = !dropzone"
          />
          <NDropdown v-if="extensions.length" direction="end" n="sm primary">
            <template #trigger="{ click }">
              <NButton
                v-tooltip.bottom-end="'Filter'"
                icon="carbon-filter" :border="false"
                title="Filter" p3 text-lg
                @click="click()"
              />
              <span flex="~ items-center justify-center" absolute bottom--1 right--1 h-4 w-4 rounded-full bg-primary:30 text-8px>
                {{ extensions.length }}
              </span>
            </template>
            <div flex="~ col" w-30 of-auto>
              <NCheckbox
                v-for="item of extensions"
                :key="item.name"
                v-model="item.value"
                flex="~ gap-2"
                rounded
                px2 py2
              >
                <span text-xs op75>
                  {{ item.name }}
                </span>
              </NCheckbox>
            </div>
          </NDropdown>
          <NButton
            v-tooltip.bottom-end="'Toggle View'"
            text-lg :border="false"
            :icon="view === 'grid' ? 'i-carbon-list' : 'i-carbon-grid'"
            title="Toggle view"
            @click="toggleView"
          />
        </div>
      </template>
      <div op50>
        <span v-if="search">{{ filtered.length }} matched · </span>
        <span>{{ assets?.length }} assets in total</span>
      </div>
    </NNavbar>

    <AssetDropZone v-model="dropzone" folder="/" />

    <template v-if="view === 'grid'">
      <template v-if="byFolders.length > 1">
        <NSectionBlock
          v-for="[folder, items] of byFolders"
          :key="folder"
          :text="folder"
          :description="`${items.length} items`"
          :open="items.length <= DETAILS_MAX_ITEMS"
          :padding="false"
        >
          <div mt--4 px2 grid="~ cols-minmax-8rem">
            <AssetGridItem v-for="a of items" :key="a.path" :asset="a" :folder="folder" @click="selected = a" />
          </div>
        </NSectionBlock>
      </template>
      <div v-else p2 grid="~ cols-minmax-8rem">
        <AssetGridItem v-for="a of filtered" :key="a.path" :asset="a" @click="selected = a" />
      </div>
    </template>
    <div v-else>
      <AssetListItem
        v-for="item, key of byTree" :key="key"
        v-model="selected"
        :item="item"
      />
    </div>
    <NDrawer
      :model-value="!!selected"
      auto-close w-120
      :top="navbar"
      @close="selected = undefined"
    >
      <AssetDetails v-if="selected" v-model="selected" />
    </NDrawer>
  </div>
</template>

<style>
img {
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
}
</style>
