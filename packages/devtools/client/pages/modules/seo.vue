<script setup lang="ts">
import Fuse from 'fuse.js'

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

const headTags = computedAsync(async () => {
  return await head.value?.resolveTags()
})

const search = ref('')
const fuse = computed(() => new Fuse(headTags.value || [], {
  keys: [
    'tag',
    'props.name',
    'props.property',
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

const showPreview = ref(true)

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
  <div flex="~" h-full w-full of-hidden>
    <div flex-auto of-auto bg-active>
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
      <NSectionBlock text="Tags" icon="carbon:checkmark-filled">
        <NCard mb4 grid="~ cols-[max-content_1fr]" items-center justify-between of-hidden>
          <template v-for="item, index of filtered" :key="index">
            <div v-if="index" x-divider />
            <div v-if="index" x-divider />
            <div mr2 px4 py2 op50>
              {{ item.props?.name ?? item.props?.property ?? Object.keys(item.props)[0] ?? item.tag }}
            </div>
            <div w-full p2 font-mono>
              {{ item.props?.content ?? item.props?.href ?? item.textContent ?? JSON.stringify(item.props) }}
            </div>
          </template>
        </NCard>
        <div v-if="!filtered.length" py4 text-center text-gray-400>
          No tags found
        </div>
      </NSectionBlock>
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
    <SeoSocialCards v-if="showPreview && headTags?.length" :tags="headTags" border="l base" w-540px flex-none />
  </div>
  <HelpFab>
    <DocsSeo />
  </HelpFab>
</template>
