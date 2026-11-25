<script setup lang="ts">
import { computed } from 'vue'
import { definePageMeta } from '#imports'
import { useClient } from '~/composables/client'
import { formatBytes, usePayloadAnalysis } from '~/composables/payload-analysis'

definePageMeta({
  icon: 'carbon-data-set',
  title: 'Payload',
  category: 'analyze',
  show: () => {
    const client = useClient()
    return () => !!client.value
  },
  order: 7,
})

const client = useClient()
const payload = computed(() => client.value?.nuxt.payload)
const revision = computed(() => client.value?.revision.value)
const { analysis } = usePayloadAnalysis()

async function refreshData(keys?: string[]) {
  await client.value?.nuxt.hooks.callHookParallel('app:data:refresh', keys)
}
</script>

<template>
  <div v-if="client">
    <!-- Payload Size Warning and Breakdown -->
    <div v-if="analysis">
      <!-- Warning Banner -->
      <div
        v-if="analysis.isLarge || analysis.isCritical"
        class="payload-warning"
        :class="{
          'warning-large': analysis.isLarge && !analysis.isCritical,
          'warning-critical': analysis.isCritical,
        }"
      >
        <div class="warning-icon">
          <div :class="analysis.isCritical ? 'i-carbon-warning-alt' : 'i-carbon-warning'" />
        </div>
        <div class="warning-content">
          <div class="warning-title">
            {{ analysis.isCritical ? 'Critical' : 'Large' }} Payload Size
          </div>
          <div class="warning-message">
            Total payload size is <strong>{{ formatBytes(analysis.totalSize) }}</strong>.
            {{ analysis.isCritical
              ? 'This significantly impacts initial page load and should be optimized.'
              : 'Consider optimizing data transfer to improve page load performance.' }}
          </div>
        </div>
      </div>

      <!-- Payload Breakdown -->
      <NSectionBlock
        icon="carbon-chart-visualization"
        text="Payload Breakdown"
        :description="`Total size: ${formatBytes(analysis.totalSize)}`"
        :padding="false"
      >
        <div class="breakdown-container">
          <div
            v-for="item in analysis.breakdown"
            :key="item.key"
            class="breakdown-item"
          >
            <div class="breakdown-header">
              <div class="breakdown-label">
                <span class="breakdown-name">{{ item.key }}</span>
                <span
                  v-if="item.origin"
                  class="breakdown-origin"
                  :title="item.origin === 'client' ? 'Produced on the client (no SSR)' : 'May include server-rendered and client-fetched values'"
                  :class="{
                    'origin-server': item.origin === 'server',
                    'origin-client': item.origin === 'client',
                    'origin-mixed': item.origin === 'mixed',
                  }"
                >
                  {{ item.origin }}
                </span>
              </div>
              <div class="breakdown-size">
                {{ formatBytes(item.size) }}
                <span class="breakdown-percentage">({{ item.percentage.toFixed(1) }}%)</span>
              </div>
            </div>
            <div class="breakdown-bar">
              <div
                class="breakdown-bar-fill"
                :class="{
                  'bar-large': item.percentage > 50,
                  'bar-medium': item.percentage > 20 && item.percentage <= 50,
                  'bar-small': item.percentage <= 20,
                }"
                :style="{ width: `${item.percentage}%` }"
              />
            </div>
          </div>
        </div>
      </NSectionBlock>
    </div>
    <NSectionBlock
      icon="carbon-data-set"
      text="State"
      description="Keyed state from `useState`"
      :padding="false"
    >
      <StateGroup
        :state="payload.state"
        :revision="revision"
        prefix="$s"
      />
    </NSectionBlock>
    <NSectionBlock
      icon="carbon-data-blob"
      text="Data"
      description="Keyed state from `useAsyncData`"
      :padding="false"
    >
      <template #actions>
        <NButton
          n="xs primary" self-start
          icon="i-carbon-recycle"
          @click="refreshData()"
        >
          Re-fetch all data
        </NButton>
      </template>
      <StateGroup
        :state="payload.data"
        :revision="revision"
      >
        <template #actions="{ isOpen, name }">
          <NButton
            v-if="isOpen && name"
            v-tooltip.bottom="`Re-fetch '${name}'`"
            :title="`Re-fetch '${name}'`"
            icon="carbon-recycle"
            :border="false"
            @click="refreshData([name])"
          />
        </template>
      </StateGroup>
    </NSectionBlock>
    <NSectionBlock
      v-if="payload.functions && Object.keys(payload.functions).length"
      icon="carbon-function"
      text="Functions"
      description="State for functions"
    >
      <StateEditor
        ml--6
        :state="payload.functions"
        :revision="revision"
      />
    </NSectionBlock>
  </div>

  <HelpFab>
    <DocsPayload />
  </HelpFab>
</template>

<style scoped>
.payload-warning {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.5rem;
  margin: 0.5rem;
}

.warning-large {
  background-color: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.warning-critical {
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.warning-icon {
  flex-shrink: 0;
  font-size: 1.25rem;
  margin-top: 0.125rem;
}

.warning-large .warning-icon {
  color: rgb(251, 191, 36);
}

.warning-critical .warning-icon {
  color: rgb(239, 68, 68);
}

.warning-content {
  flex: 1;
}

.warning-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.warning-large .warning-title {
  color: rgb(251, 191, 36);
}

.warning-critical .warning-title {
  color: rgb(239, 68, 68);
}

.warning-message {
  font-size: 0.875rem;
  opacity: 0.9;
  line-height: 1.5;
}

.breakdown-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.breakdown-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.breakdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.breakdown-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.breakdown-name {
  font-weight: 500;
}

.breakdown-origin {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  text-transform: uppercase;
  font-weight: 600;
}

.origin-server {
  background-color: rgba(59, 130, 246, 0.1);
  color: rgb(59, 130, 246);
}

.origin-client {
  background-color: rgba(16, 185, 129, 0.1);
  color: rgb(16, 185, 129);
}

.origin-mixed {
  background-color: rgba(168, 85, 247, 0.1);
  color: rgb(168, 85, 247);
}

.breakdown-size {
  font-family: monospace;
  font-size: 0.875rem;
}

.breakdown-percentage {
  opacity: 0.6;
  font-size: 0.75rem;
}

.breakdown-bar {
  height: 0.5rem;
  background-color: rgba(128, 128, 128, 0.1);
  border-radius: 0.25rem;
  overflow: hidden;
}

.breakdown-bar-fill {
  height: 100%;
  border-radius: 0.25rem;
  transition: width 0.3s ease;
}

.bar-large {
  background-color: rgb(239, 68, 68);
}

.bar-medium {
  background-color: rgb(251, 191, 36);
}

.bar-small {
  background-color: rgb(59, 130, 246);
}
</style>
