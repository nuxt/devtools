<script setup lang="ts">
import { objectPick } from '@antfu/utils'
import { nextTick } from 'vue'
import type { RouteInfo } from '~~/../src/types'

definePageMeta({
  icon: 'carbon-tree-view-alt',
  title: 'Routes',
  requireClient: true,
})

const router = useClientRouter()
const route = useClientRoute()

const serverPages = await rpc.getServerPages()
const layouts = await rpc.getLayouts()

const routes = $computed((): RouteInfo[] => {
  return (router.value?.getRoutes() || [])
    .map(i => objectPick(i, ['path', 'name', 'meta', 'props', 'children']))
    .map((i) => {
      return {
        ...serverPages.find(j => j.name && j.name === i.name),
        ...i,
      }
    })
})

const routeInput = ref(route.value?.path || '/')

if (router.value) {
  router.value.afterEach(() => {
    nextTick(() => {
      routeInput.value = route.value.path
    })
  })
}

async function navigate() {
  if (routeInput.value !== route.value.path)
    router.value.push(routeInput.value || '/')
}

const routeInputMatched = $computed(() => {
  if (routeInput.value === route.value.path)
    return []
  return router.value.resolve(routeInput.value || '/').matched
})
</script>

<template>
  <div v-if="router">
    <SectionBlock
      icon="carbon-3d-curve-auto-colon"
      :collapse="false"
      text="Current Route"
    >
      <NTextInput
        v-model="routeInput"
        font-mono
        icon="carbon-direction-right-01"
        @keydown.enter="navigate"
      />
      <div py2 text-sm>
        <template v-if="route.path !== routeInput">
          <span op50>Navigate </span>
          <span font-mono>{{ route.path }}</span>
          <span op50> -> </span>
          <span font-mono :class="routeInputMatched.length ? 'text-green' : 'text-orange'">{{ routeInput || '/' }}</span>
          <span op50>, press Enter to go</span>
        </template>
        <template v-else>
          <span op50>Edit to navigate</span>
        </template>
      </div>
    </SectionBlock>
    <SectionBlock
      icon="carbon-tree-view-alt"
      text="Routes"
      description="All the routes in registered in your application"
    >
      <PagesTable
        :pages="routes"
        :layouts="layouts"
        :matched="route.matched"
        :matched-pending="routeInputMatched"
      />
    </SectionBlock>
  </div>
  <LaunchPage
    v-else
    icon="carbon-tree-view-alt"
    title="Nuxt routing is not enabled"
    description="Create `./pages/index.vue` to enable routing"
    :actions="[
      {
        label: 'Learn more about routing',
        src: 'https://nuxt.com/docs/getting-started/routing',
        attrs: {
          n: 'primary',
        },
      },
      {
        label: 'Enable routing',
        handle() {
          return rpc.runWizard('enablePages')
        },
      },
    ]"
  />
</template>
