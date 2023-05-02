<script setup lang="ts">
import Fuse from 'fuse.js'
import type { HeadTag } from '@vueuse/head'

definePageMeta({
  icon: 'carbon-cloud-monitoring',
  title: 'SEO',
  layout: 'full',
  category: 'analyze',
  experimental: true,
  show: () => !!useClient().value,
})

// TODO:
const tagList = [
  {
    name: 'main',
    icon: 'carbon-tag-group',
    tags: [
      'lang',
      'title',
      'description',
      'keywords',
      'favicon',
      'viewport',
      'robots',
    ],
  },
  {
    name: 'og',
    icon: 'carbon-logo-facebook',
    tags: [
      'og:title',
      'og:description',
      'og:image',
      'og:url',
      'og:site_name',
      'og:type',
      'og:locale',
    ],
  },
  {
    name: 'twitter',
    icon: 'carbon-logo-twitter',
    tags: [
      'twitter:card',
      'twitter:site',
      'twitter:creator',
      'twitter:title',
      'twitter:description',
      'twitter:image',
      'twitter:image:alt',
    ],
  },
  {
    name: 'other',
    icon: 'carbon-tag-export',
    tags: [
      'apple-touch-icon',
      'theme-color',
      'copyright',
      'author',
    ],
  },
]

const head = useClientHead()

const headTags = computedAsync<HeadTag[]>(async () => {
  return await head.value.resolveTags()
})

const search = ref('')
const fuse = computed(() => new Fuse(headTags.value || [], {
  keys: [
    'tag',
    'props.name',
    'props.content',
  ],
}))
const filtered = computed(() => {
  const result = search.value
    ? fuse.value.search(search.value).map(i => i.item)
    : (headTags.value || [])
  return result
})

function getTags(tags: string[]) {
  return tags.filter(tag => !headTags.value?.some((item) => {
    if (item.tag === 'meta')
      return item.props.name?.includes(tag)
    if (item.tag === 'title')
      return tag === 'title'
    if (item.tag === 'htmlAttrs') {
      if (tag === 'lang')
        return item.props.lang
    }
    if (item.tag === 'link') {
      if (item.props.rel === 'icon')
        return tag === 'favicon'
    }
    return false
  }))
}

const missingTags = computed(() => {
  return tagList.map(group => ({
    name: group.name,
    icon: group.icon,
    tags: getTags(group.tags),
  })).filter(group => group.tags.length)
})

const missingTagsCount = computed(() => missingTags.value.reduce((acc, cur) => acc + cur.tags.length, 0))

async function refresh() {
  headTags.value = await head.value.resolveTags()
}
</script>

<template>
  <PanelLeftRight storage-key="tab-seo">
    <template #left>
      <div border="r base" px4 py3>
        <SeoSocialCards v-if="headTags" :tags="headTags" />
        <NSectionBlock v-if="missingTagsCount" :text="`Missing Tags (${missingTagsCount})`" icon="carbon:warning-filled" :padding="false">
          <NSectionBlock v-for="group in missingTags" :key="group.name" :text="`${group.name} (${group.tags.length})`" :icon="group.icon" :open="false">
            <NCard v-for="tag of group.tags" :key="tag" mb4 flex items-center justify-between p4>
              <div flex items-center>
                <NIcon icon="carbon:warning-filled" mr2 bg-red />
                {{ tag }}
              </div>
              <span class="text-gray-400">
                Missing
              </span>
            </NCard>
          </NSectionBlock>
        </NSectionBlock>
      </div>
    </template>
    <template #right>
      <div bg-active>
        <Navbar v-model:search="search" no-padding px4 pb2 pt4>
          <template #actions>
            <div flex-none flex="~ gap4">
              <NButton n="green" title="Refresh Data" @click="refresh">
                <NIcon icon="carbon:reset" />
              </NButton>
            </div>
          </template>
          <div op50>
            <span v-if="search">{{ filtered.length }} matched · </span>
            <span>{{ headTags?.length }} tags in total</span>
          </div>
        </Navbar>
        <NSectionBlock text="Tags" icon="carbon:checkmark-filled">
          <NCard v-for="item, index of filtered" :key="index" mb4 flex items-center justify-between p4>
            <div flex items-center>
              <NIcon icon="carbon:checkmark-filled" mr2 bg-green />
              {{ item.props?.name ?? Object.keys(item.props)[0] ?? item.tag }}
            </div>
            <div text-end class="max-w-4/5">
              {{ item.props?.content ?? item.textContent ?? JSON.stringify(item.props) }}
            </div>
          </NCard>
          <div v-if="!filtered.length" py4 text-center text-gray-400>
            No tags found
          </div>
        </NSectionBlock>
      </div>
    </template>
  </PanelLeftRight>
  <HelpFab>
    <DocsSeo />
  </HelpFab>
</template>
