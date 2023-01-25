<script setup lang="ts">
definePageMeta({
  icon: 'carbon-plug',
  title: 'Plugins',
})

const config = $(useServerConfig())
</script>

<template>
  <div v-if="config">
    <SectionBlock
      icon="carbon-plug"
      text="Plugins"
      :description="`Total plugins: ${config.plugins.length}`"
    >
      <PluginItem
        v-for="plugin, idx of config.plugins"
        :key="typeof plugin === 'string' ? plugin : plugin.src"
        :plugin="plugin"
        :index="idx + 1"
        py2 ml--4 border="b base"
      />
    </SectionBlock>
  </div>
</template>
