<script setup lang="ts">
import { ModuleCustomTab } from '~~/../src/types';

definePageMeta({
  icon: 'carbon-nominal',
  title:'Custom',
})

const tabs = await getTabs()
const route = useRoute()

const name = $computed(()=>route.query.name)
const tab = $computed(() => tabs.find(i=>i.name === name) as ModuleCustomTab)
</script>

<template>
  <iframe :src="tab.view.src" class="w-full h-full" />
</template>
