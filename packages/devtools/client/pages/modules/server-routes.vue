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

const serverRoutes = useServerRoutes()

const showRuntime = ref(false)

const filterByCollection = computed(() => {
  const collections: ServerRouteInfo[] = []

  const addRouteToCollection = (collection: ServerRouteInfo, route: ServerRouteInfo) => {
    collection.routes = collection.routes || []
    collection.routes.push(route)
  }

  const routes = showRuntime.value
    ? serverRoutes.value
    : serverRoutes.value?.filter(r => r.type !== 'runtime')

  routes?.forEach((item) => {
    const filepathParts = item.filepath.split('/')
    const collectionNames = filepathParts.slice(0, -1).slice(filepathParts.indexOf('server') + 1)

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

  return collections.length === 1 ? collections[0].routes ?? [] : collections
})

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
  const result = !serverRoutes.value
    ? []
    : !search.value
        ? serverRoutes.value
        : fuse.value.search(search.value).map(i => i.item)
  if (!showRuntime.value)
    return result.filter(i => i.type !== 'runtime')
  return result
})
</script>

<template>
  <PanelLeftRight>
    <template #left>
      <Navbar v-model:search="search" pb2>
        <div flex="~ gap1" text-sm>
          <span v-if="search" op50>{{ filtered.length }} matched · </span>
          <span op50>{{ serverRoutes?.length }} routes in total</span>
          <div flex-auto />
          <NCheckbox v-model="showRuntime" n="indigo sm">
            <span op75>Runtime routes</span>
          </NCheckbox>
        </div>
      </Navbar>

      <ServerRouteListItem
        v-for="item in filterByCollection"
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
