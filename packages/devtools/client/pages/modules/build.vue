<script setup lang="ts">
definePageMeta({
  icon: 'carbon-edge-node',
  title: 'Build Analyze',
  layout: 'full',
})

const ROUTE_ANALYZE = '/__nuxt_devtools__/analyze/'

const info = useAnalyzeBuildInfo()
const lastestBuild = computed(() => info.value?.builds[0])
const router = useRouter()
const processId = ref<string>()
const PromiseConfirm = createTemplatePromise<boolean>()

const shouldGotoTerminal = ref(false)
async function start() {
  if (!await PromiseConfirm.start())
    return

  processId.value = await rpc.startAnalyzeBuild()
  if (shouldGotoTerminal.value)
    gotoTerminal()
}

function gotoTerminal() {
  if (processId.value)
    router.push(`/modules/terminals?id=${encodeURIComponent(processId.value)}`)
}

const timeAgo = useTimeAgo(() => lastestBuild.value?.endTime ?? 0)

const tabs = computed(() => {
  const items = [
    { name: 'Overview', id: 'overview' },
  ]
  if (lastestBuild.value?.features.bundleClient)
    items.push({ name: 'Client Bundle', id: 'bundle-client' })
  if (lastestBuild.value?.features.bundleNitro)
    items.push({ name: 'Nitro Bundle', id: 'bundle-nitro' })
  if (lastestBuild.value?.features.viteInspect)
    items.push({ name: 'Vite Inspect', id: 'vite-inspect' })

  return items
})

const selected = ref(tabs.value[0])
</script>

<template>
  <div h-full grid="~ rows-[max-content_1fr]">
    <div flex="~ wrap" w-full>
      <template v-for="tab, idx of tabs" :key="idx">
        <button
          px4 py2 border="r base"
          hover="bg-active"
          :class="tab.id === selected.id ? '' : 'border-b'"
          @click="selected = tab"
        >
          <div :class="tab.id === selected.id ? '' : 'op30' ">
            {{ tab.name }}
          </div>
        </button>
      </template>
      <div border="b base" flex-auto />
    </div>
    <div
      v-if="selected.id === 'overview'"
      flex="~ col gap-2 items-center justify-center"
    >
      <div v-if="lastestBuild">
        Last build: {{ timeAgo }}
      </div>
      <div v-else>
        Last build: Never
      </div>
      <NButton v-if="!info?.isBuilding" n="primary" icon="carbon-edge-node" @click="start()">
        Build Now
      </NButton>
      <NButton v-else n="primary" icon="carbon-circle-dash animate-spin" @click="gotoTerminal()">
        Building...
      </NButton>
    </div>
    <iframe
      v-lazy-show="selected.id === 'bundle-client'"
      :src="`${ROUTE_ANALYZE}${lastestBuild?.name}/client.html`"
      h-full w-full
    />
    <iframe
      v-lazy-show="selected.id === 'bundle-nitro'"
      :src="`${ROUTE_ANALYZE}${lastestBuild?.name}/nitro.html`"
      h-full w-full
    />
    <iframe
      v-lazy-show="selected.id === 'vite-inspect'"
      :src="`${ROUTE_ANALYZE}${lastestBuild?.name}/.vite-inspect/`"
      h-full w-full
    />
  </div>

  <PromiseConfirm v-slot="{ resolve }">
    <NDialog :model-value="true" @close="resolve(false)">
      <div p4 flex="~ col gap-1">
        <h3 class="text-lg font-medium leading-6">
          Start analyze build?
        </h3>
        <p op50>
          The following command will be executed in your terminal:
        </p>
        <NCodeBlock
          code="npx nuxi analyze --no-serve"
          lang="bash" my3 px4 py2 border="~ base rounded"
          :lines="false"
        />
        <NCheckbox v-model="shouldGotoTerminal" n="primary">
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
