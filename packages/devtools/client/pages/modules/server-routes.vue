<script setup lang="ts">
import Fuse from 'fuse.js'
import type { ServerRouteInfo } from '~/../src/types'

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

const selected = computed(() => serverRoutes.value?.find(i => i.route === vueRoute.query?.path))
const search = ref('')

const filtered = computed(() => {
  if (!serverRoutes.value)
    return []
  if (!search.value)
    return serverRoutes.value
  return fuse.value.search(search.value).map(i => i.item)
})

const filterByGroup = computed(() => {
  const routes = filtered.value || []
  const groups = routes.reduce((acc, route) => {
    const group = route.type || 'other'
    if (!acc[group])
      acc[group] = []
    acc[group].push(route)
    return acc
  }, {} as Record<string, ServerRouteInfo[]>)

  return Object.entries(groups).map(([group, routes]) => ({
    group,
    routes,
  }))
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

      <template v-if="filterByGroup.length > 1">
        <NSectionBlock
          v-for="group, i of filterByGroup"
          :key="group.group"
          :text="group.group"
          :open="i === 0"
        >
          <NCard>
            <ServerRouteListItem
              v-for="item, index of group.routes"
              :key="item.filepath"
              :item="item"
              :selected="selected"
              :divider="index !== group.routes.length - 1"
            />
          </NCard>
        </NSectionBlock>
      </template>

      <template v-else>
        <ServerRouteListItem
          v-for="item of filtered"
          :key="item.filepath"
          :item="item"
          :selected="selected"
        />
      </template>
    </template>
    <template #right>
      <KeepAlive :max="10">
        <ServerRouteDetails
          v-if="selected"
          :key="selected.filepath"
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
