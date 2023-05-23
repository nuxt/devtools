<script setup lang="ts">
import Fuse from 'fuse.js'

definePageMeta({
  icon: 'carbon-cloud',
  title: 'Server Routes',
  layout: 'full',
  category: 'server',
  show() {
    const routes = useServerRoutes()
    return () => routes.value?.length
  },
})

const vueRoute = useRoute()

const serverRoutes = useServerRoutes()
const fuse = computed(() => new Fuse(serverRoutes.value || [], {
  keys: [
    'method',
    'route',
  ],
  shouldSort: true,
}))

const selected = computed(() => serverRoutes.value?.find(i => i.path === vueRoute.query?.path))
const search = ref('')

const filtered = computed(() => {
  if (!serverRoutes.value)
    return []
  if (!search.value)
    return serverRoutes.value
  return fuse.value.search(search.value).map(i => i.item)
})
</script>

<template>
  <PanelLeftRight>
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
</template>
