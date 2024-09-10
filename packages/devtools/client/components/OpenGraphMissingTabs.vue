<script setup lang="ts">
import { defu } from 'defu'
import type { MetaFlatInput } from '@unhead/schema'
import type { ReactiveHead } from '@unhead/vue'
import { ogTags } from '../data/open-graph'
import type { NormalizedHeadTag } from '../../src/types'

const props = defineProps<{
  tags: NormalizedHeadTag[]
  matchedRouteFilepath?: string
}>()

const missingTags = computed(() => {
  return ogTags.filter(define => !props.tags?.some(tag => tag.name === define.name))
})

const codeSnippet = computed(() => {
  let mergedHeadOptions: Partial<ReactiveHead> = {}
  const mergedSeoMetaOptions: Partial<MetaFlatInput> = {}
  missingTags.value
    .forEach((tag) => {
      if (tag.seoMeta)
        Object.assign(mergedSeoMetaOptions, tag.seoMeta)
      else
        mergedHeadOptions = defu(mergedHeadOptions, tag.head)
    })

  const lines = []

  if (Object.keys(mergedSeoMetaOptions).length) {
    const body = JSON.stringify(mergedSeoMetaOptions, null, 2)
      .replace(/"([^"]+)":/g, '$1:')
      .replace(/"/g, '\'')

    lines.push(`useSeoMeta(${body})`)
  }

  if (Object.keys(mergedHeadOptions).length) {
    const body = JSON.stringify(mergedHeadOptions, null, 2)
      .replace(/"([^"]+)":/g, '$1:')
      .replace(/"/g, '\'')

    lines.push(`useHead(${body})`)
  }

  return lines.join('\n\n')
})

const copy = useCopy()
const openInEditor = useOpenInEditor()

const tabs = [
  'Missing Tags',
  'Code Snippet',
]
const selectedTab = ref(tabs[0])
</script>

<template>
  <template v-if="missingTags.length">
    <NSectionBlock
      text="Missing Tags"
      :description="`${missingTags.length} missing tags`"
      icon="carbon:warning-other"
      header-class="text-orange op100! [[open]_&]:text-inherit"
      :padding="false"
    >
      <div flex="~ wrap" mt--2 w-full flex-none>
        <template v-for="name, idx of tabs" :key="idx">
          <button
            px4 py2 border="r t base"
            hover="bg-active"
            :class="name === selectedTab ? '' : 'border-b'"
            @click="selectedTab = name"
          >
            <div :class="name === selectedTab ? '' : 'op30' " capitalize>
              {{ name }}
            </div>
          </button>
        </template>
        <div border="b base" flex-auto />
      </div>

      <NCard
        v-if="selectedTab === tabs[0]"
        grid="~ cols-[1fr] lg:cols-[max-content_1fr]" m4 items-center justify-between of-hidden
      >
        <template v-for="item, index of missingTags" :key="index">
          <div v-if="index" x-divider />
          <div v-if="index" x-divider />
          <div flex="~ gap-1 items-center" class="px2 pt2" lg="px4 py2">
            <div i-carbon-warning text-orange />
            <NLink
              op-50
              :href="item.docs"
              target="_blank"
              n="orange"
            >
              {{ item.name }}
            </NLink>
          </div>
          <div w-full p2 op75>
            {{ item.description }}
          </div>
        </template>
      </NCard>
      <div v-else m4 flex="~ col gap-2">
        <p flex="~ gap-1 wrap items-center">
          <NButton
            icon="carbon-copy" n="xs" px-2
            @click="copy(codeSnippet, 'open-graph-suggestion')"
          >
            Copy
          </NButton>
          the following code snippet and paste it into your
          <NButton
            v-if="matchedRouteFilepath"
            icon="carbon-launch" n="xs" px-2
            @click="openInEditor(matchedRouteFilepath)"
          >
            page component
          </NButton>
          <span v-else>page component</span>
          to full fill the missing tags.
        </p>
        <NCard relative n-code-block>
          <NCodeBlock
            :code="codeSnippet"
            lang="ts"
            :lines="false"
            w-full of-auto p3
          />
          <div flex="~ gap-2" n="sm primary" absolute right-2 top-2>
            <NButton
              icon="carbon-copy"
              @click="copy(codeSnippet, 'open-graph-suggestion')"
            >
              Copy
            </NButton>
          </div>
        </NCard>
      </div>
    </NSectionBlock>
  </template>
</template>
