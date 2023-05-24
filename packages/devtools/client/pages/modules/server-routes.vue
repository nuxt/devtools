<script setup lang="ts">
import Fuse from 'fuse.js'

definePageMeta({
  icon: 'carbon-cloud',
  title: 'Server Routes',
  layout: 'full',
  category: 'server',
  show() {
    return useServerRoutes().value?.length
  },
})

const vueRoute = useRoute()
const vueRouter = useRouter()

const globalSettings = ref(false)

const state = useDevToolsServerRouteSelectedState()
const { serverRoutes: options } = useDevToolsTabsOptions()
const serverRoutes = useServerRoutes()
const fuse = computed(() => new Fuse(serverRoutes.value || [], {
  keys: [
    'method',
    'route',
  ],
  shouldSort: true,
}))

const selected = computed(() => {
  const route = serverRoutes.value?.find(i => i.path === vueRoute.query?.path)
  if (route)
    state.value.route = route.path
  if (state.value.route)
    vueRouter.push({ query: { path: state.value.route } })
  return route
})
const search = ref('')

const filtered = computed(() => {
  if (!serverRoutes.value)
    return []
  if (!search.value)
    return serverRoutes.value
  return fuse.value.search(search.value).map(i => i.item)
})

function clearResponseCache() {
  state.value.responses = []
}
</script>

<template>
  <PanelLeftRight storage-key="tab-server-routes">
    <template #left>
      <Navbar v-model:search="search" pb2>
        <div flex="~ gap1" text-sm op50>
          <span v-if="search">{{ filtered.length }} matched · </span>
          <span>{{ serverRoutes?.length }} routes in total</span>
        </div>
      </Navbar>

      <template v-for="item of filtered" :key="item.id">
        <NuxtLink
          flex="~ gap-2" items-center hover-bg-active px2 py1
          :class="[{ 'bg-active': selected?.path === item.path }]"
          :to="{ query: { path: item.path } }"
        >
          <div w-12 flex-none text-right>
            <Badge
              :class="getRequestMethodClass(item.method || '*')"
              title="updates available"
              v-text="(item.method || '*').toUpperCase()"
            />
          </div>
          <span font-mono text-sm>{{ item.route }}</span>
        </NuxtLink>
        <div x-divider />
      </template>
    </template>
    <template #right>
      <KeepAlive :max="10">
        <ServerRouteDetails
          v-if="selected"
          :key="selected.path"
          :route="selected"
        />
      </KeepAlive>
      <NPanelGrids v-if="!selected">
        <NCard px6 py2>
          <span op75>Select a route to start</span>
        </NCard>
      </NPanelGrids>
    </template>
  </PanelLeftRight>
  <button
    pos="absolute bottom-5 right-5"
    border="~ orange rounded-full "
    flex="~ items-center justify-center"
    bg="bg-base op50!" z-110 h-11 w-11 text-orange backdrop-blur-8 light:shadow
    hover="bg-active"
    title="Settings"
    @click="globalSettings = !globalSettings"
  >
    <div carbon-settings />
  </button>
  <DrawerRight
    v-model="globalSettings"
    auto-close
    @close="globalSettings = false"
  >
    <div mr8 p3>
      <div flex gap-4>
        <div flex items-center gap-2>
          <div>
            <span>Cache Limit</span>
            <span op50> (per route)</span>
          </div>
          <NSelect v-model="options.cacheLimit">
            <option v-for="item of [5, 10, 15, 20]" :key="item" :value="item">
              {{ item }}
            </option>
          </NSelect>
        </div>
        <div flex-auto />
        <NButton n="red" icon="carbon-erase" @click="clearResponseCache">
          Clear All Cache
        </NButton>
      </div>
      <div mt4 x-divider />
      <div flex="~ col gap-2" mt4>
        <span>
          Global Params <span op50>(will be used for every route)</span>
        </span>
        <ServerRouteInputs
          v-model="state.inputs"
          :keys="['tab', 'type', 'key', 'value']"
          :exclude="['tab']"
          :defaults="{ tab: 'query', type: 'text' }"
        >
          <template #input="{ item }">
            <NSelect v-model="item.tab">
              <option v-for="i of ['params', 'query', 'body', 'headers']" :key="i" :value="i">
                {{ i }}
              </option>
            </NSelect>
          </template>
        </ServerRouteInputs>
      </div>
    </div>
  </DrawerRight>
</template>
