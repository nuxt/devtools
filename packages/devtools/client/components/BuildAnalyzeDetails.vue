<script setup lang="ts">
import { useRuntimeConfig } from '#imports'
import { formatTimeAgo } from '@vueuse/core'
import type { AnalyzeBuildMeta } from '../../src/types'

const props = defineProps<{
  current: AnalyzeBuildMeta
  prev?: AnalyzeBuildMeta
}>()

const runtimeConfig = useRuntimeConfig()
const ROUTE_ANALYZE = `${runtimeConfig.app.baseURL}/__nuxt_devtools__/analyze/`.replace(/\/+/g, '/')

const tabs = computed(() => {
  const items = [
    { name: 'Overview', id: 'overview' },
  ]
  if (props.current.features.bundleClient)
    items.push({ name: 'Client Bundle', id: 'bundle-client' })
  if (props.current.features.bundleNitro)
    items.push({ name: 'Nitro Bundle', id: 'bundle-nitro' })
  if (props.current.features.viteInspect)
    items.push({ name: 'Vite Inspect', id: 'vite-inspect' })

  return items
})

const selectedTab = ref(tabs.value[0])

function formatFileSize(bytes: number) {
  if (bytes < 1024)
    return `${bytes}B`
  if (bytes < 1024 * 1024)
    return `${(bytes / 1024).toFixed(1)}KB`
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / 1024 / 1024).toFixed(1)}MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)}GB`
}

function formatDuration(build: AnalyzeBuildMeta) {
  return `${((build.endTime - build.startTime) / 1000).toFixed(1)}s`
}

async function clear(name: string) {
  return rpc.clearAnalyzeBuilds(await ensureDevAuthToken(), [name])
}
</script>

<template>
  <div h-full grid="~ rows-[max-content_1fr]">
    <div flex="~ wrap" w-full>
      <template v-for="tab, idx of tabs" :key="idx">
        <button
          px4 py2 border="r base"
          hover="bg-active"
          :class="tab.id === selectedTab.id ? '' : 'border-b'"
          @click="selectedTab = tab"
        >
          <div :class="tab.id === selectedTab.id ? '' : 'op30' ">
            {{ tab.name }}
          </div>
        </button>
      </template>
      <div border="b base" flex-auto />
    </div>
    <div
      v-if="selectedTab.id === 'overview'"
      flex="~ col gap-4 items-center justify-center" p4
    >
      <div flex-auto />
      <div grid="~ cols-[30px_1fr] gap-x-2 gap-y-3 items-center justify-center" w-100>
        <div i-carbon-commit text-xl />
        <div>
          <div text-sm op50>
            Name
          </div>
          <div>{{ current.name }}</div>
        </div>
        <div i-carbon-time text-xl />
        <div>
          <div text-sm op50>
            Build duration
          </div>
          <div>{{ formatDuration(current) }}</div>
        </div>
        <template v-if="current.size?.clientBundle">
          <div i-carbon-cics-program text-xl />
          <div>
            <div text-sm op50>
              Client bundle size
            </div>
            <div>{{ formatFileSize(current.size.clientBundle) }}</div>
          </div>
        </template>
        <template v-if="current.size.nitroBundle">
          <div i-carbon-bare-metal-server text-xl />
          <div>
            <div text-sm op50>
              Nitro bundle size
            </div>
            <div>{{ formatFileSize(current.size.nitroBundle) }}</div>
          </div>
        </template>
        <div i-carbon-edge-node text-xl />
        <div>
          <div text-sm op50>
            Built
          </div>
          <div>{{ formatTimeAgo(new Date(current.endTime)) }}</div>
        </div>
        <div i-carbon:folder-parent text-xl />
        <div>
          <div text-sm op50>
            Report Path
          </div>
          <FilepathItem :filepath="current.analyzeDir" />
        </div>
      </div>
      <div flex-auto />
      <NButton n="rose" icon="carbon-delete" @click="clear(current.name)">
        Delete this report
      </NButton>
    </div>
    <iframe
      v-lazy-show="selectedTab.id === 'bundle-client'"
      :src="`${ROUTE_ANALYZE}${current.slug}/client.html`"
      h-full w-full
    />
    <iframe
      v-lazy-show="selectedTab.id === 'bundle-nitro'"
      :src="`${ROUTE_ANALYZE}${current.slug}/nitro.html`"
      h-full w-full
    />
    <iframe
      v-lazy-show="selectedTab.id === 'vite-inspect'"
      :src="`${ROUTE_ANALYZE}${current.slug}/.vite-inspect/`"
      h-full w-full
    />
  </div>
</template>
