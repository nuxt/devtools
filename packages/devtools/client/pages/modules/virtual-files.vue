<script setup lang="ts">
import Fuse from 'fuse.js'

definePageMeta({
  icon: 'i-carbon-border-none',
  title: 'Virtual Files',
})

interface VfsData {
  rootDir: string
  entries: {
    id: string
    path: string
  }[]
}

interface VfsFile {
  id: string
  content: string
}

const searchString = ref('')

const { data } = await useFetch<VfsData>('/_vfs.json', {
  key: 'vfs-list',
  baseURL: '/',
  responseType: 'json',
})

const fileId = computed(() => useRoute().query?.id as string | undefined)

const current = ref<VfsFile>()

watchEffect(() => {
  if (!fileId.value)
    return
  const url = `/_vfs.json/${encodeURIComponent(fileId.value)}`
  fetch(url)
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
  return data.value.entries
    // Hide Nuxt dist files, as they are aliased as `#build`
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
  <PanelLeftRight class="virtual-files" storage-key="tab-virtual-files">
    <template #left>
      <div pb2 p3 navbar-glass border="b base">
        <NTextInput
          v-model="searchString"
          icon="carbon-search"
          placeholder="Search..."
          n="primary"
        />
      </div>
      <template
        v-for="f of filteredFiles" :key="f.id"
      >
        <NuxtLink
          px2 text-sm py1 font-mono block truncate select-none
          :to="`/modules/virtual-files?id=${encodeURIComponent(f.id)}`"
          :class="f.id === current?.id ? 'text-primary n-bg-active' : 'text-secondary hover:n-bg-hover'"
        >
          {{ toShortPath(f.id) }}
        </NuxtLink>
        <div x-divider />
      </template>
    </template>

    <template #right>
      <div v-if="current?.content" h-full of-hidden flex="~ col">
        <div border="b base" text-sm flex-none px4 py2 op75>
          <code>{{ current.id }}</code>
        </div>
        <NCodeBlock h-full text-sm of-auto :code="current.content" lang="typescript" />
      </div>
      <span v-else h-full flex items-center justify-center op50>Select one file to start</span>
    </template>
  </PanelLeftRight>
</template>

<style>
.virtual-files .shiki {
  padding: 10px;
  background: none !important;
}
</style>
