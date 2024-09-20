<script setup lang="ts">
import { useSchemaInput } from '~/composables/state-schema'

defineProps<{
  getter: () => { name?: string, input: string }
}>()

const input = useSchemaInput()
</script>

<template>
  <NButton
    v-tooltip="'Generate Data Schema'"
    title="Generate Data Schema"
    icon="carbon:container-services"
    :border="false"
    @click="input = getter()"
  />
</template>
