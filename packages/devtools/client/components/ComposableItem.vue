<script setup lang="ts">
import type { Import, UnimportMeta } from 'unimport'

const props = defineProps<{
  item: Import
  metadata?: UnimportMeta
  filepath?: string
}>()

const copy = useCopy()

const name = computed(() => props.item.as || props.item.name)
const usageCount = computed(() => props.metadata?.injectionUsage?.[name.value]?.count || 0)
const modules = computed(() => props.metadata?.injectionUsage?.[name.value]?.moduleIds || [])
</script>

<template>
  <VDropdown :disabled="!props.metadata">
    <button hover:text-primary>
      <code
        px2 py1 rounded font-mono text-sm bg-gray:5
        :class="metadata && !usageCount ? 'op30 hover:op100' : ''"
      >
        {{ name }}
        <sup v-if="usageCount" text-primary>x{{ usageCount }}</sup>
      </code>
    </button>
    <template #popper>
      <div max-w-100>
        <div text-sm px4 py3>
          <NMarkdown
            v-if="item.meta?.description"
            tag="div"
            text-sm pb3
            :markdown="item.meta.description"
          />
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
              <span op50>It has been referenced </span><strong text-primary>{{ usageCount }}</strong><span op50> times by:</span>
            </div>
            <div flex="~ col gap-2" text-sm items-start pt3>
              <FilepathItem
                v-for="id of modules" :key="id"
                :filepath="id"
              />
            </div>
          </template>
          <template v-else>
            <div op50 text-sm>
              Not in use via auto import.
            </div>
          </template>
        </div>
      </div>
    </template>
  </VDropdown>
</template>
