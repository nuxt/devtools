<script setup lang="ts">
import { defu } from 'defu'
import type { ReactiveHead } from '@unhead/vue'
import type { NormalizedHeadTag } from '~/../src/types/ui-state'
import { seoTags } from '~/data/seo'

definePageMeta({
  icon: 'icon-park-outline:seo',
  title: 'SEO',
  layout: 'full',
  category: 'analyze',
  experimental: true,
  show: () => !!useClient().value,
})

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
}, [])

const missingTags = computed(() => {
  return seoTags.filter(define => !headTags.value?.some(tag => tag.name === define.name))
})

const missingRequiredTags = computed(() => {
  return missingTags.value.filter(i => i.suggestion === 'required')
})
const missingRecommendedTags = computed(() => {
  return missingTags.value.filter(i => i.suggestion === 'recommended')
})

const showPreview = ref(true)

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
  return {
    code: `useHead(${body})`,
    lang: 'ts',
    name: 'useHead',
  }
})

function refresh() {
  counter.value += 1
}

const router = useClientRouter()
const route = useClientRoute()
const routeInput = ref('')

async function navigate() {
  if (routeInput.value !== route.value.path)
    router.value.push(routeInput.value || '/')
}

const routeInputMatched = computed(() => {
  if (routeInput.value === route.value.path)
    return []
  return router.value.resolve(routeInput.value || '/').matched
})

until(route).toBeTruthy().then((v) => {
  routeInput.value = v.path
})

until(router).toBeTruthy().then((v) => {
  v.afterEach(() => {
    nextTick(() => {
      routeInput.value = route.value.path
    })
  })
})
</script>

<template>
  <div flex="~" h-full w-full of-hidden>
    <div h-full flex-auto of-auto>
      <Navbar>
        <template #search>
          <NTextInput
            v-model="routeInput"
            placeholder="Route"
            icon="carbon-direction-right-01 scale-y--100"
            n="primary" flex-auto font-mono
            class="px-5 py-2"
            :class="route.path === routeInput ? '' : routeInputMatched.length ? 'text-green' : 'text-orange' "
            @keydown.enter="navigate"
          />
        </template>
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
      </Navbar>
      <div flex="~ col gap-4" p4>
        <!-- TODO: show current route -->
        <NCard grid="~ cols-[max-content_1fr]" items-center justify-between of-hidden>
          <template v-for="item, index of headTags" :key="index">
            <div v-if="index" x-divider />
            <div v-if="index" x-divider />
            <div mr2 px4 py2 op50>
              {{ item.name }}
            </div>
            <div w-full p2 font-mono>
              {{ item.value }}
              <!-- TODO: make link clickable -->
            </div>
          </template>
        </NCard>

        <template v-if="missingTags.length">
          <div>{{ missingRequiredTags.length }} required, {{ missingRecommendedTags.length }} recommended</div>
          <NCard grid="~ cols-[max-content_1fr]" items-center justify-between of-hidden>
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
                  :to="item.docs"
                  n="primary" cursor-pointer
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Docs
                </NLink>
              </div>
            </template>
          </NCard>
          <NCard n-code-block>
            <CodeSnippet :snippet="codeSnippet" />
          </NCard>
        </template>
      </div>
    </div>
    <SocialPreviewGroup v-if="showPreview && headTags?.length" :tags="headTags" border="l base" w-540px flex-none />
  </div>

  <HelpFab>
    <DocsSeo />
  </HelpFab>
</template>
