<script setup lang="ts">
import type { NormalizedHeadTag } from '~/../src/types/ui-state'
import { ogTags } from '~/data/open-graph'

definePageMeta({
  icon: 'carbon:image-search',
  title: 'Open Graph',
  layout: 'full',
  category: 'analyze',
  show: () => {
    const client = useClient()
    return () => !!client.value
  },
})

const counter = ref(0)
const head = useClientHead()

const headTags = computedAsync(async () => {
  // eslint-disable-next-line ts/no-unused-expressions
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

const showPreview = ref(true)

function refresh() {
  counter.value += 1
}

const router = useClientRouter()
const route = useClientRoute()
const routeInput = ref('')
const routes = useMergedRouteList()
const openInEditor = useOpenInEditor()

async function navigate() {
  if (routeInput.value !== route.value.path)
    router.value.push(routeInput.value || '/')
}

const routeInputMatched = computed(() => {
  if (routeInput.value === route.value.path)
    return []
  return router.value.resolve(routeInput.value || '/').matched
})

const routeMatchedFilePath = computed(() => {
  const matched = routes.value.find(i => i.path === route.value?.matched?.[0]?.path)
  return matched?.file || matched?.meta?.file as string
})

function getDocs(item: NormalizedHeadTag) {
  return ogTags.find(i => i.name === item.name)?.docs
}

until(route).toBeTruthy().then((v) => {
  routeInput.value = v.path
})

until(router).toBeTruthy().then((v) => {
  v.afterEach(() => {
    nextTick(() => {
      routeInput.value = route.value.path
      // try refresh after route change, to get async updates
      setTimeout(refresh, 200)
      setTimeout(refresh, 800)
    })
  })
})
</script>

<template>
  <div grid="~ lg:cols-2" h-full w-full of-hidden>
    <div flex-auto of-auto>
      <NNavbar>
        <template #search>
          <NTextInput
            v-model="routeInput"
            placeholder="Route"
            icon="carbon-direction-right-01 scale-y--100"
            n="primary" flex-auto font-mono
            class="px-5 py-2"
            :class="route?.path === routeInput ? '' : routeInputMatched.length ? 'text-green' : 'text-orange' "
            @keydown.enter="navigate"
          />
        </template>
        <template #actions>
          <div flex-none flex="~ gap2 items-center">
            <NButton
              v-if="routeMatchedFilePath"
              v-tooltip="'Open file in editor'"
              text-lg :border="false"
              icon="carbon:launch"
              title="Open file in editor"
              @click="openInEditor(routeMatchedFilePath)"
            />

            <NButton
              v-tooltip="'Refresh Data'"
              text-lg :border="false"
              icon="carbon:reset"
              title="Refresh Data"
              @click="refresh"
            />

            <NButton
              v-tooltip="'Toggle Preview'"
              text-lg :border="false"
              :icon="showPreview ? 'carbon:side-panel-open' : 'carbon:open-panel-right'"
              title="Toggle Preview"
              @click="showPreview = !showPreview"
            />
          </div>
        </template>
      </NNavbar>
      <div flex="~ col">
        <NSectionBlock
          text="Tags"
          icon="carbon:tag-group"
        >
          <!-- TODO: show current route -->
          <NCard grid="~ cols-[max-content_1fr]" items-center justify-between of-hidden>
            <template v-for="item, index of headTags" :key="index">
              <div v-if="index" x-divider />
              <div v-if="index" x-divider />
              <div mr2 px4 py2>
                <NLink
                  op50
                  :href="getDocs(item)"
                  target="_blank"
                  n="primary"
                >
                  {{ item.name }}
                </NLink>
              </div>
              <NLink
                :href="String(item.value).match(/^https?:\/\//) ? item.value : undefined"
                target="_blank"
                w-full p2 font-mono
                n="primary"
              >
                {{ item.value }}
              </NLink>
            </template>
          </NCard>
        </NSectionBlock>
        <OpenGraphMissingTabs :tags="headTags" :matched-route-filepath="routeMatchedFilePath" />
      </div>
    </div>
    <SocialPreviewGroup
      v-if="showPreview && headTags?.length"
      :tags="headTags"
      flex-none border-base
      lt-lg="border-t"
      lg="h-full w-140 border-l"
    />
  </div>

  <HelpFab>
    <DocsOpenGraph />
  </HelpFab>
</template>
