<script setup lang="ts">
import { objectPick } from '@antfu/utils'
import { nextTick } from 'vue'
import type { RouteInfo } from '~~/../src/types'

definePageMeta({
  icon: 'carbon-tree-view-alt',
  title: 'Pages',
  requireClient: true,
  order: 1,
})

const router = useClientRouter()
const route = useClientRoute()
const config = useServerConfig()

const serverPages = useServerPages()
const layouts = useLayouts()

const routes = computed((): RouteInfo[] => {
  return (router.value?.getRoutes() || [])
    .map(i => objectPick(i, ['path', 'name', 'meta', 'props', 'children']))
    .map((i) => {
      return {
        ...serverPages.value?.find(j => j.name && j.name === i.name),
        ...i,
      }
    })
})

const routeInput = ref('')

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

async function navigate() {
  if (routeInput.value !== route.value.path)
    router.value.push(routeInput.value || '/')
}

const routeInputMatched = computed(() => {
  if (routeInput.value === route.value.path)
    return []
  return router.value.resolve(routeInput.value || '/').matched
})

function navigateToRoute(path: string) {
  router.value.push(path)
}
</script>

<template>
  <div v-if="config?.pages && router" h-full of-auto>
    <div border="b base" flex="~ col gap1" navbar-glass px6 py4>
      <div>
        <template v-if="route.path !== routeInput">
          <span op50>Navigate from </span>
          <span font-mono>{{ route.path }}</span>
          <span op50> to </span>
        </template>
        <template v-else>
          <span op50>Current route</span>
        </template>
      </div>
      <NTextInput
        v-model="routeInput"
        font-mono
        icon="carbon-direction-right-01 scale-y--100"
        :class="route.path === routeInput ? '' : routeInputMatched.length ? 'text-green' : 'text-orange' "
        @keydown.enter="navigate"
      />
      <div>
        <template v-if="route.path !== routeInput">
          <span>Press <b font-bold>Enter</b> to navigate</span>
          <span v-if="!routeInputMatched.length" text-orange op75> (no match)</span>
        </template>
        <template v-else>
          <span op50>Edit path above to navigate</span>
        </template>
      </div>
    </div>
    <NSectionBlock
      v-if="routeInputMatched.length"
      icon="carbon-tree-view"
      text="Matched Routes"
      :padding="false"
    >
      <RoutesTable
        :pages="routeInputMatched"
        :layouts="layouts || []"
        :matched="[]"
        :matched-pending="routeInputMatched"
        @navigate="navigateToRoute"
      />
    </NSectionBlock>
    <NSectionBlock
      icon="carbon-tree-view-alt"
      text="All Routes"
      :description="`${routes.length} routes registered in your application`"
      padding="pr5"
    >
      <RoutesTable
        :pages="routes"
        :layouts="layouts || []"
        :matched="route.matched"
        :matched-pending="routeInputMatched"
        @navigate="navigateToRoute"
      />
    </NSectionBlock>
  </div>
  <LaunchPage
    v-else
    icon="carbon-tree-view-alt"
    title="Nuxt Routing"
    description="Create `./pages/index.vue` to enable routing"
    :actions="[
      {
        label: 'Learn more',
        src: 'https://nuxt.com/docs/getting-started/routing',
        attrs: {
          n: 'primary',
        },
      },
      {
        label: 'Enable Routing',
        handle() {
          return rpc.runWizard('enablePages')
        },
      },
    ]"
  />
</template>
