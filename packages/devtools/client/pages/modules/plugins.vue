<script setup lang="ts">
definePageMeta({
  icon: 'carbon-plug',
  title: 'Plugins',
  order: 5,
})

const config = useServerConfig()
</script>

<template>
  <div v-if="config">
    <NSectionBlock
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
    </NSectionBlock>
  </div>
</template>
