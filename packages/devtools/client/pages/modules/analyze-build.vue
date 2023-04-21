<script setup lang="ts">
import { formatTimeAgo } from '@vueuse/core'
import type { AnalyzeBuildMeta } from '~/../src/types'

definePageMeta({
  icon: 'carbon-edge-node',
  title: 'Build Analyze',
  layout: 'full',
})

const ROUTE_ANALYZE = '/__nuxt_devtools__/analyze/'

const PromiseConfirm = createTemplatePromise<boolean>()

const info = useAnalyzeBuildInfo()
const router = useRouter()
const route = useRoute()
const processId = ref<string>()

const selected = computed(() => {
  const name = route.query.name as string
  return info.value?.builds.find(b => b.name === name) ?? info.value?.builds[0]
})

const shouldGotoTerminal = ref(false)

const buildNameInput = ref('')
const buildNameConflicted = computed(() => info.value?.builds.some(b => b.name === buildNameInput.value.trim()))
async function start() {
  buildNameInput.value = await rpc.generateAnalyzeBuildName()

  if (!await PromiseConfirm.start())
    return

  processId.value = await rpc.startAnalyzeBuild(buildNameInput.value)
  if (shouldGotoTerminal.value)
    gotoTerminal()
}

function escapeName(name?: string) {
  return name?.replace(/[^a-z0-9-]/ig, '_')
}

function gotoTerminal() {
  if (processId.value)
    router.push(`/modules/terminals?id=${encodeURIComponent(processId.value)}`)
}

const tabs = computed(() => {
  const items = [
    { name: 'Overview', id: 'overview' },
  ]
  if (selected.value?.features.bundleClient)
    items.push({ name: 'Client Bundle', id: 'bundle-client' })
  if (selected.value?.features.bundleNitro)
    items.push({ name: 'Nitro Bundle', id: 'bundle-nitro' })
  if (selected.value?.features.viteInspect)
    items.push({ name: 'Vite Inspect', id: 'vite-inspect' })

  return items
})

const selectedTab = ref(tabs.value[0])

function formatDuration(build: AnalyzeBuildMeta) {
  return `${((build.endTime - build.startTime) / 1000).toFixed(1)}s`
}
</script>

<template>
  <PanelLeftRight :left-size="20">
    <template #left>
      <div flex="~ col">
        <template v-for="build of info?.builds" :key="build.name">
          <NuxtLink
            flex="~ col gap1" hover:bg-active p3
            :class="build.name === selected?.name ? 'text-primary bg-active' : ''"
            :to="`?name=${encodeURIComponent(build.name)}`"
          >
            <code>{{ build.name }}</code>
            <div flex="~ gap-1 items-center" text-sm op60>
              <div i-carbon-time />
              <span>{{ formatDuration(build) }}</span>
              <div flex-auto />
              <span>{{ formatTimeAgo(new Date(build.endTime)) }}</span>
            </div>
          </NuxtLink>
          <div x-divider />
        </template>
        <div flex="~ items-center justify-center" p4>
          <NButton v-if="!info?.isBuilding" n="primary" icon="carbon-edge-node" @click="start()">
            Start a new build
          </NButton>
          <NButton v-else n="primary" icon="carbon-circle-dash animate-spin" @click="gotoTerminal()">
            Building...
          </NButton>
        </div>
      </div>
    </template>
    <template #right>
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
          flex="~"
        >
          <div v-if="selected" grid="~ cols-[30px_1fr] gap2 items-center justify-center" ma w-100>
            <div i-carbon-commit title="Name" />
            <div>{{ selected.name }}</div>
            <div i-carbon-edge-node title="Build time" />
            <div>{{ formatTimeAgo(new Date(selected.endTime)) }}</div>
            <div i-carbon-time title="Build duration" />
            <div>{{ formatDuration(selected) }}</div>
          </div>
        </div>
        <iframe
          v-lazy-show="selectedTab.id === 'bundle-client'"
          :src="`${ROUTE_ANALYZE}${escapeName(selected?.name)}/client.html`"
          h-full w-full
        />
        <iframe
          v-lazy-show="selectedTab.id === 'bundle-nitro'"
          :src="`${ROUTE_ANALYZE}${escapeName(selected?.name)}/nitro.html`"
          h-full w-full
        />
        <iframe
          v-lazy-show="selectedTab.id === 'vite-inspect'"
          :src="`${ROUTE_ANALYZE}${escapeName(selected?.name)}/.vite-inspect/`"
          h-full w-full
        />
      </div>
    </template>
  </PanelLeftRight>

  <PromiseConfirm v-slot="{ resolve }">
    <NDialog :model-value="true" @close="resolve(false)">
      <div flex="~ col gap-1" w-250 p4>
        <h3 class="text-lg font-medium leading-6" mb2>
          Start analyze build?
        </h3>
        <p op50>
          Enter the name of the build:
        </p>
        <NTextInput
          v-model="buildNameInput"
          placeholder="Build name"
        />
        <NTip v-if="buildNameConflicted" n-orange>
          A build with the same name already exists, continue would overrides the previous build result.
        </NTip>
        <div my3 x-divider />
        <p op50>
          The following command will be executed in your terminal:
        </p>
        <NCodeBlock
          :code="`npx nuxi analyze --no-serve --name=${buildNameInput}`"
          lang="bash" px4 py2 border="~ base rounded"
          :lines="false"
        />
        <NCheckbox v-model="shouldGotoTerminal" mt2 n="primary">
          Navigate to terminal
        </NCheckbox>

        <div flex="~ gap-3" mt2 justify-end>
          <NButton @click="resolve(false)">
            Cancel
          </NButton>
          <NButton n="solid primary" @click="resolve(true)">
            Start
          </NButton>
        </div>
      </div>
    </NDialog>
  </PromiseConfirm>
</template>
