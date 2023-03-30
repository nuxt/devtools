<script setup lang="ts">
import { onKeyDown } from '@vueuse/core'
import Fuse from 'fuse.js'
import type { AssetInfo } from '~/../src/types'

definePageMeta({
  icon: 'carbon-image-copy',
  title: 'Assets',
})

const search = ref('')

// TODO: add global settings for user
const showAll = ref(false)
const showByFolder = ref(false)
const view = ref<'list' | 'grid'>('grid')

const folders = ref<string[]>(['/'])
const foldersFlat = computed(() => folders.value.join(''))
const currentFolder = computed(() => folders.value[folders.value.length - 1])

const assets = asyncComputed(async () => {
  return await rpc.getStaticAssets(foldersFlat.value, showAll.value)
})

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
function selectAsset(asset: AssetInfo) {
  if (wsConnecting.value || wsError.value)
    return

  if (asset.type === 'folder')
    return folders.value.push(asset.path)

  selected.value = asset
}

function changeFolder(folder: string) {
  if (folder === currentFolder.value || wsConnecting.value || wsError.value || showAll.value)
    return
  folders.value = folders.value.slice(0, folders.value.indexOf(folder) + 1)
}

function goBackFolder() {
  if (currentFolder.value === '/' || wsConnecting.value || wsError.value || showAll.value)
    return
  folders.value.pop()
}

function toggleView() {
  view.value = view.value === 'list' ? 'grid' : 'list'
}

onKeyDown('Escape', () => {
  selected.value = undefined
})

onKeyDown('Backspace', () => {
  goBackFolder()
})

const router = useRouter()

watch(folders, () => {
  router.push({ query: { folder: foldersFlat.value } })
}, { deep: true })

onMounted(() => {
  if (router.currentRoute.value.query.folder) {
    const query = (router.currentRoute.value.query.folder as string)
    // TODO: use a better way to sanitize
    const xssPattern = /[<>]/g
    const encoded = encodeURIComponent(query).replace(xssPattern, '')
    const decoded = decodeURIComponent(encoded).replace(xssPattern, '')
    folders.value.push(...decoded.split('/').filter(Boolean).map(str => `${str}/`))
  }
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
      <div items-center flex justify-between>
        <div flex items-center>
          <NIconButton icon="carbon-arrow-left" w-8 h-8 mr-2 @click="goBackFolder" />
          <div v-for="folder of folders" :key="folder" cursor-pointer underline hover-text-gray :class="{ 'text-green': folder === currentFolder }" @click="changeFolder(folder)">
            <span>
              {{ folder }}
            </span>
          </div>
        </div>
        <div>
          <span>show all assets: <NCheckbox v-model="showAll" /></span>
          <span v-if="view === 'grid' && showAll">show by folder: <NCheckbox v-model="showByFolder" /></span>
        </div>
        <div op50>
          <span v-if="search">{{ filtered.length }} matched · </span>
          <span>{{ assets?.length }} assets in total</span>
        </div>
      </div>
    </div>

    <template v-if="view === 'grid'">
      <template v-if="showByFolder && showAll">
        <NSectionBlock
          v-for="[folder, items] of byFolders"
          :key="folder"
          :text="folder"
          :description="`${items.length} items`"
          :open="items.length < 30"
          :padding="false"
        >
          <div px2 mt--4 grid="~ cols-minmax-8rem">
            <AssetGridItem v-for="a of items" :key="a.path" :asset="a" :folder="folder" @click="selectAsset(a)" />
          </div>
        </NSectionBlock>
      </template>
      <div v-else p2 grid="~ cols-minmax-8rem">
        <AssetGridItem v-for="a of filtered" :key="a.path" :asset="a" @click="selectAsset(a)" />
      </div>
    </template>
    <div v-else>
      <AssetListItem v-for="a of filtered" :key="a.path" :asset="a" @click="selectAsset(a)" />
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
