<script setup lang="ts">
const { filepath } = defineProps<{
  filepath: string
}>()

const config = $(useServerConfig())
const short = $computed(() => (filepath && config) ? getShortPath(filepath, config.rootDir) : filepath)
</script>

<template>
  <button
    font-mono
    hover:underline
    ws-nowrap
    of-hidden
    @click="openInEditor(filepath)"
  >
    {{ short }}
  </button>
</template>
