<script setup lang="ts">
const client = useClient()
const layouts = await rpc.getLayouts()
const matched = $computed(() => [...client.value?.nuxt?.vueApp.config.globalProperties.$route.matched || []])

const usedLayouts = $computed(() => {
  const set = new Set<string>()
  matched.forEach((i) => {
    set.add(i.meta.layout || 'default')
  })
  return set
})
</script>

<template>
  <SectionBlock
    v-if="layouts.length"
    icon="carbon-template"
    text="Layouts"
    divider
  >
    <template v-for="i of layouts" :key="i.name">
      <ComponentItem :component="i as any">
        <div v-if="usedLayouts.has(i.name)" text-primary i-carbon-checkmark-outline title="Layout used in current route" />
      </ComponentItem>
    </template>
  </SectionBlock>
</template>
