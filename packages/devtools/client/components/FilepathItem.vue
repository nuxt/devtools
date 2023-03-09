<script setup lang="ts">
const props = defineProps<{
  filepath: string
}>()

const config = useServerConfig()
const short = computed(() => (props.filepath && config.value)
  ? getShortPath(props.filepath, config.value.rootDir)
  : props.filepath,
)
</script>

<template>
  <button
    ws-nowrap of-hidden font-mono hover:underline truncate
    :title="filepath"
    @click="openInEditor(filepath)"
  >
    {{ short }}
  </button>
</template>
