<script setup lang="ts">
import { defu } from 'defu'
import type { ReactiveHead } from '@unhead/vue'
import type { NormalizedHeadTag } from '../../src/types'
import { seoTags } from '../data/seo'

const props = defineProps<{
  tags: NormalizedHeadTag[]
}>()

const missingTags = computed(() => {
  return seoTags.filter(define => !props.tags?.some(tag => tag.name === define.name))
})

const missingRequiredTags = computed(() => {
  return missingTags.value.filter(i => i.suggestion === 'required')
})
const missingRecommendedTags = computed(() => {
  return missingTags.value.filter(i => i.suggestion === 'recommended')
})

const mergedMissingTags = computed(() => {
  let data: Partial<ReactiveHead> = {}
  missingTags.value
    .forEach((tag) => {
      data = defu(data, tag.default)
    })
  return data
})

const codeSnippet = computed(() => {
  const body = JSON.stringify(mergedMissingTags.value, null, 2)
    .replace(/"([^"]+)":/g, '$1:')
    .replace(/"/g, '\'')
  return `useHead(${body})`
})

const copy = useCopy()
const openInEditor = useOpenInEditor()

const tabs = [
  'Missing Tags',
  'Code Snippet',
]
const selectedTab = ref(tabs[0])

const route = useClientRoute()
const routes = useMergedRouteList()
const routeMatchedFilePath = computed(() => {
  const matched = routes.value.find(i => i.path === route.value?.matched?.[0]?.path)
  return matched?.file || matched?.meta?.file as string
})
</script>

<template>
  <template v-if="missingTags.length">
    <NSectionBlock
      text="Missing Tags"
      :description="`${missingTags.length} missing tags (${missingRequiredTags.length} required, ${missingRecommendedTags.length} recommended)`"
      icon="carbon:warning-other"
      header-class="text-orange op100! [[open]_&]:text-inherit"
      :padding="false"
    >
      <div flex="~ wrap" w-full flex-none>
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

      <NCard v-if="selectedTab === tabs[0]" grid="~ cols-[max-content_1fr]" m4 items-center justify-between of-hidden>
        <template v-for="item, index of missingTags" :key="index">
          <div v-if="index" x-divider />
          <div v-if="index" x-divider />
          <div mr2 px4 py2 text-orange op75>
            <div i-carbon-warning />
            {{ item.name }}
          </div>
          <!-- TODO: use icons instead, show link to documentation -->
          <div w-full p2>
            {{ item.description }}
            <NLink
              v-if="item.docs"
              :href="item.docs"
              n="primary" cursor-pointer
              target="_blank"
              rel="noopener noreferrer"
            >
              Docs
            </NLink>
          </div>
        </template>
      </NCard>
      <div v-else m4 flex="~ col gap-2">
        <p flex="~ gap-1 wrap items-center">
          <NButton
            icon="carbon-copy"
            n="xs"
            px-2
            @click="copy(codeSnippet)"
          >
            Copy
          </NButton>
          the following code snippet and paste it into your
          <NButton
            v-if="routeMatchedFilePath"
            icon="carbon-launch"
            n="xs"
            px-2
            @click="openInEditor(routeMatchedFilePath)"
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
              @click="copy(codeSnippet)"
            >
              Copy
            </NButton>
          </div>
        </NCard>
      </div>
    </NSectionBlock>
  </template>
</template>
