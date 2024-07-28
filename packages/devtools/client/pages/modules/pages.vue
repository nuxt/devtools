<script setup lang="ts">
definePageMeta({
  icon: 'carbon-tree-view-alt',
  title: 'Pages',
  show: () => {
    const client = useClient()
    return () => !!client.value
  },
  order: 1,
})

const router = useClientRouter()
const route = useClientRoute()
const config = useServerConfig()
const serverApp = useServerApp()

const layouts = useLayouts()

const routes = useMergedRouteList()

const middleware = computed(() => serverApp.value?.middleware || [])
const routeInput = ref('')
const count = ref(0)

const currentRoute = computed(() => {
  // Additionall reactivity tracker
  // eslint-disable-next-line ts/no-unused-expressions
  (middleware.value, routeInput.value, layouts.value, count.value)
  return router.value?.currentRoute?.value?.path
})

onMounted(() => {
  if (route.value)
    routeInput.value = router.value?.currentRoute?.value?.path

  router.value?.beforeEach((to) => {
    routeInput.value = to.fullPath
  })
  router.value?.afterEach((to) => {
    routeInput.value = to.fullPath
  })
})

async function navigate() {
  if (routeInput.value !== router.value?.currentRoute?.value?.path)
    router.value.push(routeInput.value || '/')
}

const routeInputMatched = computed(() => {
  return router.value.resolve(routeInput.value || '/').matched
})

function navigateToRoute(path: string) {
  router.value.push(path)
  routeInput.value = path
}
</script>

<template>
  <div v-if="config?.pages && router" h-full of-auto>
    <div border="b base" flex="~ col gap1" px4 py3 n-navbar-glass>
      <div>
        <template v-if="currentRoute !== routeInput">
          <span op50>Navigate from </span>
          <span font-mono>{{ currentRoute }}</span>
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
        :class="currentRoute === routeInput ? '' : routeInputMatched.length ? 'text-green' : 'text-orange'"
        @keydown.enter="navigate"
      />
      <div>
        <template v-if="currentRoute !== routeInput">
          <span>Press <b font-bold>Enter</b> to navigate</span>
          <span v-if="!routeInputMatched.length" text-orange op75> (no match)</span>
        </template>
        <template v-else>
          <span op50>Edit path above to navigate</span>
        </template>
      </div>
    </div>
    <NSectionBlock
      icon="carbon-tree-view"
      text="Matched Routes"
      :padding="false"
    >
      <div min-h-14>
        <RoutesTable
          v-if="routeInputMatched.length"
          :pages="routeInputMatched"
          :layouts="layouts || []"
          :matched="route.matched"
          :matched-pending="routeInputMatched"
          @navigate="navigateToRoute"
        />
        <div v-else class="py-4 text-center">
          <span op50>No routes matched</span>
        </div>
      </div>
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
            <NBadge
              v-if="m.global"
              n="green"
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
    name="wizard-pages"
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
        async handle() {
          return rpc.runWizard(await ensureDevAuthToken(), 'enablePages')
        },
      },
    ]"
  />

  <HelpFab>
    <DocsPages />
  </HelpFab>
</template>
