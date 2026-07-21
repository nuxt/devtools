<script setup lang="ts">
import type { VersionScoreSlim } from '~/composables/state-module-scores'
import { computed, ref, watch } from 'vue'
import { formatAge, getAgeColor, statusColors } from '~/composables/state-module-scores'

const props = defineProps<{
  npm?: string
  version?: string
}>()

const API_BASE = 'https://nuxt.care/api/v1'

const versionScore = ref<VersionScoreSlim | null>(null)
const loading = ref(false)
const error = ref(false)

// Fetch version-specific score (installed modules use their version, others use "latest")
watch(
  () => [props.npm, props.version] as const,
  async ([npm, version]) => {
    if (!npm)
      return

    error.value = false
    loading.value = true

    try {
      const params = new URLSearchParams({
        package: npm,
        version: version || 'latest',
        slim: 'true',
      })
      const res = await fetch(`${API_BASE}/score?${params}`)
      if (res.ok)
        versionScore.value = await res.json()
      else
        error.value = true
    }
    catch (e) {
      console.warn('[DevTools] Failed to fetch version score:', e)
      error.value = true
    }
    finally {
      loading.value = false
    }
  },
  { immediate: true },
)

const score = computed(() => versionScore.value)
const isLoading = computed(() => loading.value && !score.value)
const color = computed(() => score.value ? statusColors[score.value.status] : undefined)
const statusLabel = computed(() => score.value?.status ? score.value.status[0]?.toUpperCase() + score.value.status.slice(1) : '')

const showUpgrade = computed(() =>
  versionScore.value?.recommendation === 'upgrade' && !versionScore.value?.isLatest,
)
const latestColor = computed(() =>
  versionScore.value?.latestStatus ? statusColors[versionScore.value.latestStatus] : undefined,
)

defineExpose({ versionScore })
</script>

<template>
  <div flex="~ gap-2 items-center">
    <template v-if="isLoading">
      <span i-carbon-circle-dash flex-none animate-spin text-lg op50 />
      <span text-sm op50>Loading health...</span>
    </template>

    <template v-else-if="error">
      <span i-carbon-warning-alt flex-none text-lg op50 />
      <span text-sm op50>Health unavailable</span>
    </template>

    <template v-else-if="score">
      <VDropdown :triggers="['hover']" :delay="{ show: 300, hide: 100 }">
        <a
          flex="~ gap-2 items-center"
          :href="`https://nuxt.care/?search=npm:${npm}`"
          target="_blank"
          rel="noopener"
          hover="op100"
        >
          <span i-carbon-health-cross flex-none text-lg op50 />
          <span text-sm op50>Health</span>
          <span text-sm font-medium :style="{ color }">{{ score.score }}/100</span>
          <span rounded-full px1.5 py0.5 text-xs :style="{ backgroundColor: `${color}20`, color }">
            {{ statusLabel }}
          </span>
        </a>
        <template #popper>
          <!-- Version-specific details (installed modules) -->
          <div v-if="versionScore" min-w-48 p2 text-sm>
            <div mb2 font-medium>
              v{{ versionScore.version }}
            </div>
            <div flex="~ col gap-1" text-xs>
              <div flex="~ justify-between">
                <span op50>Vulnerabilities</span>
                <span :class="versionScore.vulnCount > 0 ? 'text-red-500' : 'text-green-500'">
                  {{ versionScore.vulnCount }}
                </span>
              </div>
              <div flex="~ justify-between items-center">
                <span op50>Tests</span>
                <span v-if="versionScore.hasTests" i-carbon-checkmark-filled text-green-500 />
                <span v-else i-carbon-close-filled text-red-400 />
              </div>
              <div flex="~ justify-between items-center">
                <span op50>TypeScript</span>
                <span v-if="versionScore.hasTypes" i-carbon-checkmark-filled text-green-500 />
                <span v-else i-carbon-close-filled text-red-400 />
              </div>
              <div flex="~ justify-between items-center">
                <span op50>CI</span>
                <span v-if="versionScore.ciPassing === true" i-carbon-checkmark-filled text-green-500 />
                <span v-else-if="versionScore.ciPassing === false" i-carbon-close-filled text-red-400 />
                <span v-else i-carbon-help op30 />
              </div>
              <div flex="~ justify-between">
                <span op50>Published</span>
                <span :class="getAgeColor(versionScore.daysSincePublish)">{{ formatAge(versionScore.daysSincePublish, true) }}</span>
              </div>
              <div v-if="versionScore.deprecated" mt1 flex="~ gap-1 items-center" text-red-500>
                <span i-carbon-warning-alt />
                <span>Deprecated</span>
              </div>
            </div>
            <div mt2 border-t="~ base" pt2 text-xs op50>
              Click to view on nuxt.care
            </div>
          </div>
        </template>
      </VDropdown>

      <template v-if="showUpgrade && versionScore">
        <span i-carbon-arrow-right flex-none op30 />
        <span text-xs op50>v{{ versionScore.latestVersion }}</span>
        <span text-xs font-medium :style="{ color: latestColor }">({{ versionScore.latestScore }})</span>
      </template>
    </template>
  </div>
</template>
