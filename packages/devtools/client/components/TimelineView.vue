<script setup lang="ts">
import type { TimelineEvent } from '../../types'

const client = useClient()

const view = ref<'table' | 'list'>('table')
const selected = ref<TimelineEvent | undefined>()

const metrics = computed(() => client.value?.metrics.timeline())

function clear() {
  if (metrics.value)
    metrics.value.events = []
}

function toggleView() {
  view.value = view.value === 'table' ? 'list' : 'table'
}
</script>

<template>
  <div v-if="metrics" h-screen of-hidden>
    <div h-screen w-full flex flex-col>
      <div h-10 flex="~ gap-2 items-center justify-end" p2 px3>
        <VTooltip flex>
          <div
            text-lg
            :class="metrics.options.enabled ? 'i-carbon-radio-button-checked text-primary animate-pulse' : 'i-carbon-pause-outline op30'"
          />
          <template #popper>
            <div text-sm>
              {{ metrics.options.enabled ? 'Recording...' : 'Paused' }}
            </div>
          </template>
        </VTooltip>

        <NButton
          v-if="!metrics.options.enabled"
          size="small" ml1 text-sm
          n="primary"
          icon="i-carbon-play"
          @click="metrics.options.enabled = true"
        >
          Start Tracking
        </NButton>
        <NButton
          v-else
          size="small" ml1 text-sm
          n="orange"
          icon="i-carbon-stop"
          @click="metrics.options.enabled = false"
        >
          Stop Tracking
        </NButton>
        <!-- <template v-if="metrics.options.enabled">
          <NCheckbox
            v-model="metrics.options.stacktrace"
            label="Enabled"
            class="text-sm"
          >
            Record stacktrace
          </NCheckbox>
          <NCheckbox
            v-model="metrics.options.arguments"
            label="Enabled"
            class="text-sm"
          >
            Record arguments
          </NCheckbox>
        </template> -->
        <div flex-auto />
        <NIconButton
          :icon="view === 'table' ? 'i-carbon-roadmap' : 'i-carbon-list'"
          class="ml-2"
          title="Toggle View"
          @click="toggleView"
        />
        <NIconButton
          icon="i-carbon-trash-can"
          hover-text-red
          class="ml-2"
          @click="clear"
        />
      </div>
      <TimelineTable
        v-if="view === 'table'"
        :data="{ ...metrics }"
        @select="s => selected = s.event"
      />
      <TimelineList
        v-else
        :data="{ ...metrics }"
        @select="s => selected = s"
      />
    </div>
    <DrawerBottom
      :model-value="!!selected"
      auto-close
      @close="selected = undefined"
    >
      <div min-h-50 px3 py2>
        <TimelineDetailsFunction v-if="selected?.type === 'function'" :record="selected" />
        <TimelineDetailsRoute v-else-if="selected?.type === 'route'" :record="selected" />
      </div>
    </DrawerBottom>
  </div>
</template>
