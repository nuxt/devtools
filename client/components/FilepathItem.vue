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
    font-mono
    hover:underline
    ws-nowrap
    of-hidden
    @click="openInEditor(filepath)"
  >
    {{ short }}
  </button>
</template>
