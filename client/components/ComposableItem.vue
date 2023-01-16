<script setup lang="ts">
import type { Import, UnimportMeta } from 'unimport'

const { import: item, metadata } = defineProps<{
  import: Import
  metadata?: UnimportMeta
}>()

const copy = useCopy()

const name = $computed(() => item.as || item.name)
const usageCount = $computed(() => metadata?.injectionUsage?.[name]?.count || 0)
const modules = $computed(() => metadata?.injectionUsage?.[name]?.moduleIds || [])
</script>

<template>
  <VDropdown :disabled="!metadata">
    <button hover:text-primary>
      <code
        bg-gray:5 px2 py1 rounded font-mono text-sm
        :class="metadata && !usageCount ? 'op30 hover:op100' : ''"
      >
        {{ name }}
        <sup v-if="usageCount" text-primary>x{{ usageCount }}</sup>
      </code>
    </button>
    <template #popper>
      <div p4>
        <div text-sm>
          <button @click="copy(name)">
            <code text-primary bg-gray:5 px2 py1>{{ name }}</code>
          </button>
          <template v-if="usageCount">
            has been referenced <strong text-primary>{{ usageCount }}</strong> times by:
          </template>
          <template v-else>
            is not used via auto import.
          </template>
        </div>
        <div v-if="usageCount">
          <div flex="~ col gap-2" items-start pt3 text-sm>
            <FilepathItem
              v-for="id of modules" :key="id"
              :filepath="id"
            />
          </div>
        </div>
      </div>
    </template>
  </VDropdown>
</template>
