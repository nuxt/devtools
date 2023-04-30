<script setup lang="ts">
import type { PluginInfoWithMetic } from '@nuxt/devtools-kit/types'

definePageMeta({
  icon: 'carbon-plug',
  title: 'Plugins',
  category: 'analyze',
})

const app = useServerApp()
const client = useClient()

const plugins = computed((): PluginInfoWithMetic[] => {
  const plugins = app.value?.plugins || []
  const metics = client.value?.getClientPluginMetrics() || []

  return plugins.map((plugin) => {
    const p = typeof plugin === 'string' ? { src: plugin } : plugin
    return {
      ...p,
      metric: metics.find(m => m.src === p.src || m.src.startsWith(p.src)),
    }
  })
})

const totalTime = computed(() => {
  const metics = client.value?.getClientPluginMetrics() || []
  const minStart = Math.min(...metics.map(m => m.start))
  const maxEnd = Math.max(...metics.map(m => m.end))
  return maxEnd - minStart
})
</script>

<template>
  <NSectionBlock
    icon="carbon-plug"
    text="Plugins"
    :description="`Total plugins: ${plugins.length}`"
  >
    <div pt4>
      <PluginItem
        v-for="plugin, idx of plugins"
        :key="plugin.src"
        :plugin="plugin"
        :index="idx + 1"
        ml--4 border-base py2 :class="idx ? 'border-t' : ''"
      />

      <div class="text-sm" flex="~ gap-1 items-center justify-end" mt-3>
        <div i-carbon-timer text-lg op75 />
        <span op50>Total execution time:</span>
        <DurationDisplay :duration="totalTime" :factor="10" />
      </div>
    </div>
  </NSectionBlock>

  <HelpFab>
    <DocsPlugins />
  </HelpFab>
</template>
