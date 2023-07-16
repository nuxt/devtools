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

const vueRoute = useRoute()
const vueRouter = useRouter()

const serverRoutes = useServerRoutes()
const { selectedRoute, view } = useDevToolsOptions('serverRoutes')

const selected = computed(() => {
  const route = serverRoutes.value?.find(i => i.route === vueRoute.query?.path && i.method === vueRoute.query?.method)
  if (route)
    selectedRoute.value = route
  if (selectedRoute.value)
    vueRouter.push({ query: { path: selectedRoute.value.route, method: selectedRoute.value.method } })
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

  filtered.value.forEach((item) => {
    const filepathParts = item.filepath.split('/')
    const collectionNames = filepathParts.slice(filepathParts.indexOf('server') + 1)

    if (collectionNames.length > 0 && collectionNames[collectionNames.length - 1].includes('.'))
      collectionNames.pop()

    let parentCollection: ServerRouteInfo | null = null
    collectionNames.forEach((collectionName) => {
      const existingCollection = parentCollection
        ? parentCollection.routes?.find(r => r.route === collectionName)
        : collections.find(c => c.route === collectionName)

      if (existingCollection) {
        parentCollection = existingCollection
      }
      else {
        const newCollection: ServerRouteInfo = {
          route: collectionName,
          filepath: collectionName.replace(/\W/g, '-').toLowerCase(),
          type: 'collection',
          routes: [],
        }

        if (parentCollection)
          addRouteToCollection(parentCollection, newCollection)

        else
          collections.push(newCollection)

        parentCollection = newCollection
      }
    })

    if (item.type === 'runtime') {
      const runtimeCollection = collections.find(c => c.route === 'runtime')

      if (runtimeCollection) {
        addRouteToCollection(runtimeCollection, item)
      }
      else {
        const newCollection: ServerRouteInfo = {
          route: 'runtime',
          filepath: 'runtime',
          type: 'collection',
          routes: [item],
        }

        collections.push(newCollection)
      }
    }

    else if (parentCollection) {
      addRouteToCollection(parentCollection, item)
    }

    else {
      collections.push(item)
    }
  })

  return collections
})

function toggleView() {
  view.value = view.value === 'tree' ? 'list' : 'tree'
}
</script>

<template>
  <PanelLeftRight storage-key="tab-server-routes">
    <template #left>
      <Navbar v-model:search="search" pb2>
        <template #actions>
          <NIconButton
            text-lg
            :icon="view === 'list' ? 'i-carbon-list' : 'i-carbon-tree-view-alt'"
            title="Toggle view"
            @click="toggleView"
          />
        </template>
        <div flex="~ gap1" text-sm>
          <span v-if="search" op50>{{ filtered.length }} matched · </span>
          <span op50>{{ serverRoutes?.length }} routes in total</span>
        </div>
      </Navbar>

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
