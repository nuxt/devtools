<script setup lang="ts">
import { computed } from 'vue'
import { statusColors, useModuleScores } from '~/composables/state-module-scores'

const props = defineProps<{
  npm?: string
}>()

const { scores, loading } = useModuleScores()
const score = computed(() => props.npm ? scores.value.get(props.npm) : undefined)
const color = computed(() => score.value ? statusColors[score.value.status] : undefined)
</script>

<template>
  <span v-if="loading && !score" class="n-badge" op50>
    <span i-carbon-circle-dash animate-spin />
  </span>
  <a
    v-else-if="score"
    inline-flex items-center
    :href="`https://nuxt.care/?search=npm:${npm}`"
    target="_blank"
    rel="noopener"
    :title="`Nuxt Care Score: ${score.score}/100 (${score.status})`"
  >
    <span class="n-badge" :style="{ color, borderColor: color }">
      {{ score.status }}
    </span>
  </a>
</template>
