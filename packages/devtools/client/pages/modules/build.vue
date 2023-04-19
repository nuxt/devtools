<script setup lang="ts">
definePageMeta({
  icon: 'carbon-edge-node',
  title: 'Build',
  layout: 'full',
})

const info = useAnalyzeBuildInfo()
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

const timeAgo = useTimeAgo(() => info.value?.lastBuild?.buildTime ?? 0)
</script>

<template>
  <NPanelGrids>
    <div v-if="info?.lastBuild">
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
  </NPanelGrids>

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
