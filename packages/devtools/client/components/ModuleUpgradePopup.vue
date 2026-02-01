<script setup lang="ts">
import type { VersionScoreSlim } from '~/composables/state-module-scores'
import { computed } from 'vue'
import { formatAge, getAgeColor, statusColors } from '~/composables/state-module-scores'

const props = defineProps<{
  npm: string
  currentVersion: string
  latestVersion: string
  scoreData?: VersionScoreSlim | null
}>()

const emit = defineEmits<{
  upgrade: []
}>()

const scoreDiff = computed(() => {
  if (!props.scoreData?.latestScore)
    return null
  return props.scoreData.latestScore - props.scoreData.score
})

const vulnsDiff = computed(() => {
  if (props.scoreData?.latestVulnCount == null)
    return null
  return props.scoreData.latestVulnCount - props.scoreData.vulnCount
})

function getStatusColor(status: string | null | undefined) {
  if (!status)
    return statusColors.stable
  return statusColors[status as keyof typeof statusColors] || statusColors.stable
}
</script>

<template>
  <div min-w-72 p3>
    <!-- No data -->
    <div v-if="!scoreData" py4 text-center text-sm op50>
      Health data not available
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Header -->
      <div mb3 flex="~ items-center justify-between gap-2">
        <span font-medium>Health Comparison</span>
        <div flex="~ items-center gap-2">
          <a
            v-tooltip="'View details on nuxt.care'"
            :href="`https://nuxt.care/?search=npm:${npm}`"
            target="_blank"
            rel="noopener"
            rounded bg-gray:10 px1.5 py0.5 text-xs op70
            hover="bg-gray:20 op100"
          >
            nuxt.care
          </a>
          <button
            rounded bg-primary px2 py0.5 text-xs text-white
            hover="bg-primary-600"
            @click="emit('upgrade')"
          >
            <span i-carbon-upgrade mr0.5 text-xs />
            Upgrade
          </button>
        </div>
      </div>

      <!-- Comparison table -->
      <div mb3 rounded border="~ base" text-sm>
        <!-- Header row -->
        <div flex="~" border-b="~ base" bg="gray/5" text-xs font-medium op70>
          <div w-24 px2 py1 />
          <div flex-1 px2 py1 text-center>
            v{{ currentVersion }}
          </div>
          <div flex-1 px2 py1 text-center>
            v{{ latestVersion }}
          </div>
        </div>

        <!-- Score row -->
        <div flex="~" border-b="~ base">
          <div w-24 px2 py1.5 op70>
            Score
          </div>
          <div flex-1 px2 py1.5 text-center font-medium :style="{ color: getStatusColor(scoreData.status) }">
            {{ scoreData.score }}
          </div>
          <div flex-1 px2 py1.5 text-center font-medium :style="{ color: getStatusColor(scoreData.latestStatus) }">
            {{ scoreData.latestScore ?? '?' }}
            <span v-if="scoreDiff" text-xs :class="scoreDiff > 0 ? 'text-green-500' : 'text-red-500'">
              ({{ scoreDiff > 0 ? '+' : '' }}{{ scoreDiff }})
            </span>
          </div>
        </div>

        <!-- Vulnerabilities row -->
        <div flex="~" border-b="~ base">
          <div w-24 px2 py1.5 op70>
            Vulns
          </div>
          <div
            flex-1 px2 py1.5 text-center
            :class="scoreData.vulnCount > 0 ? 'text-red-500' : 'text-green-500'"
          >
            {{ scoreData.vulnCount }}
          </div>
          <div
            flex-1 px2 py1.5 text-center
            :class="(scoreData.latestVulnCount ?? 0) > 0 ? 'text-red-500' : 'text-green-500'"
          >
            {{ scoreData.latestVulnCount ?? '?' }}
            <span v-if="vulnsDiff && vulnsDiff < 0" text-xs text-green-500>({{ vulnsDiff }})</span>
          </div>
        </div>

        <!-- Age row -->
        <div flex="~" border-b="~ base">
          <div w-24 px2 py1.5 op70>
            Age
          </div>
          <div flex-1 px2 py1.5 text-center :class="getAgeColor(scoreData.daysSincePublish)">
            {{ formatAge(scoreData.daysSincePublish) }}
          </div>
          <div flex-1 px2 py1.5 text-center text-green-500>
            new
          </div>
        </div>

        <!-- Tests row -->
        <div flex="~" border-b="~ base">
          <div w-24 px2 py1.5 op70>
            Tests
          </div>
          <div flex-1 px2 py1.5 text-center>
            <span v-if="scoreData.hasTests" i-carbon-checkmark-filled text-green-500 />
            <span v-else i-carbon-close-filled text-red-400 />
          </div>
          <div flex-1 px2 py1.5 text-center>
            <span v-if="scoreData.latestHasTests" i-carbon-checkmark-filled text-green-500 />
            <span v-else-if="scoreData.latestHasTests === false" i-carbon-close-filled text-red-400 />
            <span v-else i-carbon-help op30 />
          </div>
        </div>

        <!-- TypeScript row -->
        <div flex="~" border-b="~ base">
          <div w-24 px2 py1.5 op70>
            TypeScript
          </div>
          <div flex-1 px2 py1.5 text-center>
            <span v-if="scoreData.hasTypes" i-carbon-checkmark-filled text-green-500 />
            <span v-else i-carbon-close-filled text-red-400 />
          </div>
          <div flex-1 px2 py1.5 text-center>
            <span v-if="scoreData.latestHasTypes" i-carbon-checkmark-filled text-green-500 />
            <span v-else-if="scoreData.latestHasTypes === false" i-carbon-close-filled text-red-400 />
            <span v-else i-carbon-help op30 />
          </div>
        </div>

        <!-- CI row -->
        <div flex="~" border-b="~ base">
          <div w-24 px2 py1.5 op70>
            CI
          </div>
          <div flex-1 px2 py1.5 text-center flex="~ gap-1 justify-center items-center">
            <span v-tooltip="'CI is repo-level'" i-carbon-information op30 />
          </div>
          <div flex-1 px2 py1.5 text-center>
            <span v-if="scoreData.ciPassing === true" i-carbon-checkmark-filled text-green-500 />
            <span v-else-if="scoreData.ciPassing === false" i-carbon-close-filled text-red-400 />
            <span v-else i-carbon-help op30 />
          </div>
        </div>

        <!-- Deprecated row -->
        <div flex="~">
          <div w-24 px2 py1.5 op70>
            Deprecated
          </div>
          <div flex-1 px2 py1.5 text-center>
            <span v-if="scoreData.deprecated" i-carbon-close-filled text-red-400 />
            <span v-else i-carbon-checkmark-filled text-green-500 />
          </div>
          <div flex-1 px2 py1.5 text-center>
            <span v-if="scoreData.latestDeprecated" i-carbon-close-filled text-red-400 />
            <span v-else-if="scoreData.latestDeprecated === false" i-carbon-checkmark-filled text-green-500 />
            <span v-else i-carbon-help op30 />
          </div>
        </div>
      </div>

      <!-- Recommendation badge -->
      <div
        v-if="scoreData.recommendation === 'upgrade'"
        flex="~ gap-2 items-center" rounded bg-yellow-500:10 px2 py1.5 text-sm text-yellow-600
      >
        <span i-carbon-warning-alt flex-none />
        <span>Upgrade recommended</span>
      </div>
      <div
        v-else-if="scoreData.recommendation === 'avoid'"
        flex="~ gap-2 items-center" rounded bg-red-500:10 px2 py1.5 text-sm text-red-500
      >
        <span i-carbon-close-filled flex-none />
        <span>Avoid this version</span>
      </div>
    </template>
  </div>
</template>
