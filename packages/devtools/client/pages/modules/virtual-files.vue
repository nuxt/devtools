<script setup lang="ts">
import Fuse from 'fuse.js'
import type { VfsFile } from '~/composables/state'

definePageMeta({
  icon: 'i-carbon-border-none',
  title: 'Virtual Files',
  layout: 'full',
  category: 'advanced',
})

const searchString = ref('')

const data = useVirtualFiles()

const fileId = useCurrentVirtualFile()
const current = ref<VfsFile>()

watchEffect(() => {
  if (!fileId.value)
    return
  const url = `/_vfs.json/${encodeURIComponent(fileId.value)}`
  fetch(url, {
    headers: {
      accept: 'application/json',
    },
  })
    .then(i => i.json())
    .then(i => current.value = i.current)
})

function toShortPath(path: string) {
  if (!data.value?.rootDir)
    return
  return path.startsWith(data.value?.rootDir)
    ? path.slice(data.value.rootDir.length)
    : path
}

const files = computed(() => {
  if (!data.value)
    return []
  return data.value
    .entries
    .filter(i => !i.id.startsWith(`${data.value?.rootDir || ''}/.nuxt/`))
    .sort((a, b) => a.id.localeCompare(b.id))
})

const fuse = computed(() => new Fuse(files.value, {
  keys: [
    'id',
    'path',
  ],
}))

const filteredFiles = computed(() => {
  if (!searchString.value)
    return files.value
  return fuse.value.search(searchString.value).map(i => i.item)
})
</script>

<template>
  <NSplitPane class="virtual-files" storage-key="tab-virtual-files">
    <template #left>
      <NNavbar
        v-model:search="searchString"
        no-padding p3
      />
      <template
        v-for="f of filteredFiles" :key="f.id"
      >
        <button
          block w-full select-none truncate px2 py1 text-start text-sm font-mono
          :class="f.id === current?.id ? 'text-primary n-bg-active' : 'text-secondary hover:n-bg-hover'"
          @click="fileId = f.id"
        >
          {{ toShortPath(f.id) }}
        </button>
        <div x-divider />
      </template>
    </template>

    <template #right>
      <div v-if="current?.content" h-full of-hidden flex="~ col">
        <div border="b base" flex-none px4 py2 text-sm op75>
          <code>{{ current.id }}</code>
        </div>
        <NCodeBlock h-full of-auto text-sm :code="current.content" lang="typescript" />
      </div>
      <NPanelGrids v-else>
        <NCard px6 py2>
          <span op75>Select a file to start</span>
        </NCard>
      </NPanelGrids>
    </template>
  </NSplitPane>

  <HelpFab>
    <DocsVirtualFiles />
  </HelpFab>
</template>

<style>
.virtual-files .shiki {
  padding: 10px;
  background: none !important;
}
</style>
