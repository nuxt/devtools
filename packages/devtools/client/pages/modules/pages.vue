<script setup lang="ts">
import { nextTick } from 'vue'

definePageMeta({
  icon: 'carbon-tree-view-alt',
  title: 'Pages',
  show: () => !!useClient().value,
  order: 1,
})

const router = useClientRouter()
const route = useClientRoute()
const config = useServerConfig()
const serverApp = useServerApp()

const layouts = useLayouts()

const routes = useMergedRouteList()

const middleware = computed(() => {
  return serverApp.value?.middleware || []
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
    <div border="b base" flex="~ col gap1" px4 py3 navbar-glass>
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
    <NSectionBlock
      v-if="middleware.length"
      icon="carbon:ibm-watson-studio"
      text="Middleware"
      :description="`${middleware.length} middleware registered in your application`"
      padding="px13"
    >
      <table w-full>
        <thead border="b base" h-7>
          <tr>
            <th text-left>
              Name
            </th>
            <th text-left>
              Path
            </th>
          </tr>
        </thead>
        <tr v-for="m of middleware" :key="m.path" h-7>
          <td>
            <span mr1>{{ m.name }}</span>
            <Badge
              v-if="m.global"
              bg-green-400:10 text-green-400
              title="Registered at runtime as a global component"
              v-text="'global'"
            />
          </td>
          <td>
            <FilepathItem :filepath="m.path" />
          </td>
        </tr>
      </table>
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

  <HelpFab>
    <DocsPages />
  </HelpFab>
</template>
