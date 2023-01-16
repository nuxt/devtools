<script setup lang="ts">
definePageMeta({
  icon: 'carbon-assembly-reference',
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

const { data, refresh } = await useFetch<VfsData>('/_vfs.json', {
  key: 'vfs-list',
  baseURL: '/',
  responseType: 'json',
})

const fileId = $computed(() => useRoute().query?.id as string | undefined)

const current = ref<VfsFile>()

watchEffect(() => {
  if (!fileId)
    return
  const url = `/_vfs.json/${encodeURIComponent(fileId)}`
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
})
</script>

<template>
  <div grid="~ cols-[250px_1fr]" h-full of-hidden>
    <div border="r base" flex="~ col" of-auto>
      <NuxtLink
        v-for="f of files" :key="f.id" px2 py1 border="b base" text-sm font-mono
        :to="`/modules/virtual-files?id=${encodeURIComponent(f.id)}`"
        :class="f.id === current?.id ? 'bg-truegray:20 text-base' : 'text-truegray'"
      >
        {{ toShortPath(f.id) }}
      </NuxtLink>
    </div>
    <pre v-if="current?.content" of-auto h-full p2 text-sm v-html="highlight(current?.content, 'typescript')" />
    <pre v-else flex items-center justify-center>Select one file to start</pre>
  </div>
</template>
