<script setup lang="ts">
import type { PluginInfoWithMetic } from '@nuxt/devtools-kit/types'

definePageMeta({
  icon: 'carbon-plug',
  title: 'Plugins',
  order: 5,
})

const config = useServerConfig()
const client = useClient()

const plugins = computed((): PluginInfoWithMetic[] => {
  const plugins = config.value?.plugins || []
  const metics = client.value.getClientPluginMetrics()

  return plugins.map((plugin) => {
    const p = typeof plugin === 'string' ? { src: plugin } : plugin
    return {
      ...p,
      metric: metics.find(m => m.src === p.src || m.src.startsWith(p.src)),
    }
  })
})
</script>

<template>
  <NSectionBlock
    v-if="config"
    icon="carbon-plug"
    text="Plugins"
    :description="`Total plugins: ${config.plugins.length}`"
  >
    <NTip n="green6" icon="carbon-meter">
      Plugins runs before your application at runtime, the time plugins cost will directly affect your application's initial loading time.
    </NTip>
    <div pt4>
      <PluginItem
        v-for="plugin, idx of plugins"
        :key="plugin.src"
        :plugin="plugin"
        :index="idx + 1"
        py2 ml--4 border-base :class="idx ? 'border-t' : ''"
      />
    </div>
  </NSectionBlock>
</template>
