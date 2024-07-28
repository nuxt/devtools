<script setup lang="ts">
import Fuse from 'fuse.js'
import type { ServerRouteInfo } from '~/../../src/types'

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

const inputDefaultsDrawer = ref(false)

const serverRoutes = useServerRoutes()
const currentServerRoute = useCurrentServeRoute()

const { selectedRoute, view, inputDefaults } = useDevToolsOptions('serverRoutes')

const selected = computed(() => {
  if (!currentServerRoute.value && selectedRoute.value)
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    currentServerRoute.value = selectedRoute.value.filepath

  const route = serverRoutes.value?.find(i => i.filepath === currentServerRoute.value)

  if (currentServerRoute.value !== selectedRoute.value?.filepath && route)
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    selectedRoute.value = route

  return route
})

const search = ref('')
const fuse = computed(() => new Fuse(serverRoutes.value || [], {
  keys: [
    'method',
    'route',
  ],
  shouldSort: true,
}))

const filtered = computed(() => {
  const result = !serverRoutes.value
    ? []
    : !search.value
        ? serverRoutes.value
        : fuse.value.search(search.value).map(i => i.item)
  return result
})

const filterByCollection = computed(() => {
  const collections: ServerRouteInfo[] = []

  const addRouteToCollection = (collection: ServerRouteInfo, route: ServerRouteInfo) => {
    collection.routes = collection.routes || []
    collection.routes.push(route)
  }

  const findOrCreateCollection = (routeName: string, parentCollection?: ServerRouteInfo) => {
    const existingCollection = parentCollection
      ? parentCollection.routes?.find(r => r.route === routeName)
      : collections.find(c => c.route === routeName)

    if (existingCollection)
      return existingCollection

    const newCollection: ServerRouteInfo = {
      route: routeName,
      filepath: routeName.replace(/\W/g, '-').toLowerCase(),
      type: 'collection',
      routes: [],
    }

    if (parentCollection)
      addRouteToCollection(parentCollection, newCollection)

    else
      collections.push(newCollection)

    return newCollection
  }

  filtered.value.forEach((item) => {
    let prefix: string | undefined
    let parentCollection: ServerRouteInfo | undefined

    const filepathParts = item.filepath.split('/')
    const collectionNames = filepathParts.slice(filepathParts.indexOf('server') + 1)

    if (item.type === 'runtime') {
      collectionNames[0] = 'runtime'
      const indexOfDist = filepathParts.indexOf('dist')
      if (indexOfDist !== -1) {
        prefix = filepathParts[indexOfDist - 1]
        if (prefix)
          collectionNames.splice(1, 0, prefix)
      }
    }

    if (collectionNames.length > 0 && collectionNames[collectionNames.length - 1].includes('.'))
      collectionNames.pop()

    collectionNames.forEach((collectionName) => {
      parentCollection = findOrCreateCollection(collectionName, parentCollection)
    })

    if (parentCollection)
      addRouteToCollection(parentCollection, item)
    else
      collections.push(item)
  })

  return collections
})

function toggleView() {
  view.value = view.value === 'tree' ? 'list' : 'tree'
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>

<template>
  <NSplitPane storage-key="tab-server-routes">
    <template #left>
      <NNavbar v-model:search="search" pb2>
        <template #actions>
          <NButton
            v-tooltip="'Toggle View'"
            text-lg
            :icon="view === 'list' ? 'i-carbon-list' : 'i-carbon-tree-view-alt'"
            title="Toggle view"
            :border="false"
            @click="toggleView"
          />
          <NButton
            v-tooltip="'Default Inputs'"
            text-lg
            icon="i-carbon-cics-sit-overrides"
            title="Default Inputs"
            :border="false"
            @click="inputDefaultsDrawer = !inputDefaultsDrawer"
          />
        </template>
        <div flex="~ gap1" text-sm>
          <span v-if="search" op50>{{ filtered.length }} matched · </span>
          <span op50>{{ serverRoutes?.length }} routes in total</span>
        </div>
      </NNavbar>

      <ServerRouteListItem
        v-for="item in view === 'tree' ? filterByCollection : filtered"
        :key="item.filepath"
        :item="item"
      />
    </template>
    <template #right>
      <KeepAlive :max="10">
        <ServerRouteDetails
          v-if="selected"
          :key="selected.filepath"
          :route="selected"
          @open-default-input="inputDefaultsDrawer = true"
        />
      </KeepAlive>
      <NPanelGrids v-if="!selected">
        <NCard px6 py2>
          <span op75>Select a route to start</span>
        </NCard>
      </NPanelGrids>
    </template>
  </NSplitPane>
  <NDrawer v-model="inputDefaultsDrawer" auto-close max-w-xl min-w-xl @close="inputDefaultsDrawer = false">
    <div>
      <div p4 border="b base">
        <span text-lg>Default Inputs</span>
        <br>
        <span text-white op50>Merged as default for every request in DevTools</span>
      </div>
      <NSectionBlock
        v-for="tab of Object.keys(inputDefaults)"
        :key="tab"
        :text="`${capitalize(tab)} ${inputDefaults[tab].length ? `(${inputDefaults[tab].length})` : ''}`"
        :padding="false"
        :icon="ServerRouteTabIcons[tab]"
      >
        <ServerRouteInputs v-model="inputDefaults[tab]" py0 :default="{ active: true, type: 'string' }" />
      </NSectionBlock>
    </div>
  </NDrawer>
</template>
