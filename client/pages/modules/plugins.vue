<script setup lang="ts">
import { config } from '#imports'

definePageMeta({
  icon: 'carbon-plug',
  title: 'Plugins',
})
</script>

<template>
  <div>
    <SectionBlock
      icon="carbon-plug"
      text="Plugins"
      :description="`${config.plugins.length} plugins installed`"
    >
      <PluginItem
        v-for="plugin, idx of config.plugins"
        :key="typeof plugin === 'string' ? plugin : plugin.src"
        :plugin="plugin"
        :index="idx + 1"
        py2 border="b base"
      />
    </SectionBlock>
  </div>
</template>
