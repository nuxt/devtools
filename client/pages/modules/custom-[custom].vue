<script setup lang="ts">
import type { ModuleCustomTab } from '~~/../src/types'

const tabs = await getTabs()
const route = useRoute()

const name = $computed(() => route.params.custom)
const tab = $computed(() => tabs.find(i => i.name === name) as ModuleCustomTab)
</script>

<template>
  <iframe :src="tab.view.src" class="w-full h-full" />
</template>
