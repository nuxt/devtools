<script setup lang="ts">
import type { AnalyzeBuildMeta } from '~/../src/types'
import { useRouter } from '#app/composables/router'
import { definePageMeta } from '#imports'
import { createTemplatePromise, formatTimeAgo } from '@vueuse/core'
import { computed, ref } from 'vue'
import { ensureDevAuthToken } from '~/composables/dev-auth'
import { satisfyNuxtVersion } from '~/composables/npm'
import { rpc } from '~/composables/rpc'
import { useAnalyzeBuildInfo } from '~/composables/state'
import { registerCommands } from '~/composables/state-commands'
import { useCurrentTerminalId } from '~/composables/state-routes'
import { processAnalyzeBuildInfo } from '~/composables/state-subprocess'
import { telemetry } from '~/composables/telemetry'
import { useSessionState } from '~/composables/utils'

definePageMeta({
  icon: 'carbon-edge-node',
  title: 'Build Analyze',
  layout: 'full',
  category: 'analyze',
  show() {
    return satisfyNuxtVersion('^3.5.0')
  },
})

const PromiseConfirm = createTemplatePromise<boolean>()

const info = useAnalyzeBuildInfo()
const router = useRouter()
const slug = useSessionState<string>('analyze-build:slug', '')

const selected = computed(() => info.value?.builds.find(b => b.slug === slug.value) ?? info.value?.builds[0])

const shouldGotoTerminal = ref(false)

const buildNameInput = ref('')
const buildNameConflicted = computed(() => info.value?.builds.some(b => b.name === buildNameInput.value.trim()))
async function start() {
  buildNameInput.value = await rpc.generateAnalyzeBuildName()

  if (!await PromiseConfirm.start())
    return

  telemetry('analyze-build:start')

  processAnalyzeBuildInfo.value = {
    name: buildNameInput.value,
    processId: await rpc.startAnalyzeBuild(await ensureDevAuthToken(), buildNameInput.value),
  }
  if (shouldGotoTerminal.value)
    gotoTerminal()
}

const terminalId = useCurrentTerminalId()

function getDuration(build: AnalyzeBuildMeta) {
  return `${((build.endTime - build.startTime) / 1000).toFixed(1)}s`
}

function gotoTerminal() {
  if (processAnalyzeBuildInfo.value?.processId) {
    terminalId.value = processAnalyzeBuildInfo.value.processId
    router.push('/modules/terminals')
  }
}

registerCommands(() => [
  {
    id: 'action:analyze-build: start',
    title: 'Start a new analyze build',
    icon: 'i-carbon-edge-node',
    action: start,
  },
])
</script>

<template>
  <NSplitPane :left-size="30">
    <template #left>
      <div flex="~ col">
        <template v-for="build of info?.builds" :key="build.slug">
          <button
            flex="~ col gap1" p3 hover:bg-active
            :class="build.slug === selected?.slug ? 'text-primary bg-active' : ''"
            @click="slug = build.slug"
          >
            <code>{{ build.name }}</code>
            <div flex="~ gap-1 items-center wrap" w-full text-sm op60>
              <div i-carbon-time />
              <span>{{ getDuration(build) }}</span>
              <div flex-auto />
              <span>{{ formatTimeAgo(new Date(build.endTime)) }}</span>
            </div>
          </button>
          <div x-divider />
        </template>
        <div flex="~ items-center justify-center wrap" p4>
          <NButton v-if="!processAnalyzeBuildInfo" n="primary" icon="carbon-edge-node" @click="start()">
            Start a new build
          </NButton>
          <NButton v-else n="primary" icon="carbon-circle-dash animate-spin" @click="gotoTerminal()">
            Building...
          </NButton>
        </div>
      </div>
    </template>
    <template #right>
      <BuildAnalyzeDetails v-if="selected" :current="selected" />
      <NPanelGrids v-else />
    </template>
  </NSplitPane>

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

  <HelpFab>
    <DocsAnalyzeBuild />
  </HelpFab>
</template>
