<script setup lang="ts">
import Fuse from 'fuse.js'
import type { NormalizedHeadTag } from '~/../src/types/ui-state'

definePageMeta({
  icon: 'icon-park-outline:seo',
  title: 'SEO',
  layout: 'full',
  category: 'analyze',
  experimental: true,
  show: () => !!useClient().value,
})

const seoTags = [
  // TODO: docs, links, default, types
  ['title', { suggestion: 'required' }],
  ['description', { suggestion: 'required' }],
  ['og:url', { suggestion: 'recommended' }],
  ['og:title', { suggestion: 'required' }],
  ['og:description', { suggestion: 'required' }],
  ['og:image', { suggestion: 'required' }],
  ['og:image:alt', { suggestion: 'required' }],
  ['og:type', { suggestion: 'optional' }],
  ['og:site_name', { suggestion: 'recommended' }],
  ['twitter:card', { suggestion: 'required' }],
  ['twitter:site', { suggestion: 'recommended' }],
  ['twitter:creator', { suggestion: 'recommended' }],
  ['twitter:title', { suggestion: 'recommended' }],
  ['twitter:description', { suggestion: 'recommended' }],
  ['twitter:image', { suggestion: 'required' }],
  ['twitter:image:alt', { suggestion: 'recommended' }],
] as const

const counter = ref(0)
const head = useClientHead()
const headTags = computedAsync(async () => {
  // eslint-disable-next-line no-unused-expressions
  counter.value // for force refresh
  const tags = await head.value?.resolveTags()
  return tags.map((tag): NormalizedHeadTag => {
    const props = tag.props || {}
    if (tag.tag === 'htmlAttrs' && props.lang) {
      return {
        tag: 'html',
        name: 'lang',
        value: props.lang,
      }
    }
    if (props.charset) {
      return {
        tag: 'meta',
        name: 'charset',
        value: props.charset,
      }
    }
    return {
      tag: tag.tag,
      name: props.property ?? props.name ?? props.rel ?? tag.tag,
      value: props.content ?? props.href ?? tag.textContent ?? JSON.stringify(props),
    }
  })
})

const search = ref('')
const fuse = computed(() => new Fuse(headTags.value || [], {
  keys: [
    'tag',
    'name',
    'value',
  ],
}))

const filtered = computed(() => {
  const result = search.value
    ? fuse.value.search(search.value).map(i => i.item)
    : (headTags.value || [])
  return result
})

const missingTags = computed(() => {
  return seoTags.filter(([name]) => !headTags.value?.some(tag => tag.name === name))
})

const missingRequiredTags = computed(() => {
  return missingTags.value.filter(i => i[1].suggestion === 'required')
})
const missingRecommendedTags = computed(() => {
  return missingTags.value.filter(i => i[1].suggestion === 'recommended')
})

const showPreview = ref(true)

async function refresh() {
  counter.value += 1
}
</script>

<template>
  <div flex="~" h-full w-full of-hidden>
    <div flex-auto of-auto>
      <Navbar v-model:search="search">
        <template #actions>
          <div flex-none flex="~ gap4">
            <button
              title="Refresh Data"
              @click="refresh"
            >
              <NIcon icon="carbon:reset" />
            </button>
            <button
              title="Toggle Preview"
              @click="showPreview = !showPreview"
            >
              <NIcon :icon="showPreview ? 'carbon:side-panel-open' : 'carbon:open-panel-right'" />
            </button>
          </div>
        </template>
        <div op50>
          <span v-if="search">{{ filtered.length }} matched · </span>
          <span>{{ headTags?.length }} tags in total</span>
        </div>
      </Navbar>
      <NSectionBlock
        text="SEO Tags"
        icon="carbon:tag"
        :description="`${headTags?.length} tags`"
      >
        <NCard mb4 grid="~ cols-[max-content_1fr]" items-center justify-between of-hidden>
          <template v-for="item, index of filtered" :key="index">
            <div v-if="index" x-divider />
            <div v-if="index" x-divider />
            <div mr2 px4 py2 op50>
              {{ item.name }}
            </div>
            <div w-full p2 font-mono>
              {{ item.value }}
            </div>
          </template>
        </NCard>
        <div v-if="!filtered.length" py4 text-center text-gray-400>
          No tags found
        </div>
      </NSectionBlock>
      <NSectionBlock
        v-if="missingTags.length"
        text="Missing Tags"
        icon="carbon:warning"
        :open="false"
        :description="`${missingRequiredTags.length} required, ${missingRecommendedTags.length} recommended`"
      >
        <NCard mb4 grid="~ cols-[max-content_1fr]" items-center justify-between of-hidden>
          <template v-for="item, index of missingTags" :key="index">
            <div v-if="index" x-divider />
            <div v-if="index" x-divider />
            <div mr2 px4 py2 op50>
              {{ item[0] }}
            </div>
            <!-- TODO: use icons instead, show link to documentation -->
            <div w-full p2 text-end font-mono :class="item[1].suggestion === 'required' ? 'text-red' : 'text-orange' ">
              {{ item[1].suggestion }}
            </div>
            <!-- TODO: generate snippet for copy -->
          </template>
        </NCard>
      </NSectionBlock>
    </div>
    <SeoSocialCards v-if="showPreview && headTags?.length" :tags="headTags" border="l base" w-540px flex-none />
  </div>
  <HelpFab>
    <DocsSeo />
  </HelpFab>
</template>
