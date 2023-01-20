<script setup lang="ts">
import type { Import, UnimportMeta } from 'unimport'

const { import: item, metadata } = defineProps<{
  import: Import
  metadata?: UnimportMeta
  filepath?: string
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
      <div>
        <div text-sm px4 py3>
          <div v-if="item.meta?.description" op75 pb3 text-sm>
            {{ item.meta?.description }}
          </div>
          <div flex="~ gap2" n="primary xs">
            <NButton n-solid @click="copy(name)">
              Copy
            </NButton>
            <NButton v-if="filepath" n-solid @click="filepath && openInEditor(filepath)">
              Source
            </NButton>
            <NButton v-if="item.meta?.docsUrl" n-solid :to="item.meta?.docsUrl" target="_blank">
              Docs
            </NButton>
          </div>
        </div>
        <div border="t base" px4 py3>
          <template v-if="usageCount">
            <div text-sm>
              <span op50>It has been referenced </span><strong text-primary>{{ usageCount }}</strong><span op50>times by:</span>
            </div>
            <div flex="~ col gap-2" items-start pt3 text-sm>
              <FilepathItem
                v-for="id of modules" :key="id"
                :filepath="id"
              />
            </div>
          </template>
          <template v-else>
            <div op50 text-sm>
              It's not used via auto import.
            </div>
          </template>
        </div>
      </div>
    </template>
  </VDropdown>
</template>
