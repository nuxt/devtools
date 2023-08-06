<script setup lang="ts">
defineProps<{
  getter: () => { name?: string; input: string }
}>()

const input = useSchemaInput()
</script>

<template>
  <NIconButton
    v-tooltip="'Generate Data Schema'"
    title="Generate Data Schema"
    icon="carbon:container-services"
    @click="input = getter()"
  />
</template>
