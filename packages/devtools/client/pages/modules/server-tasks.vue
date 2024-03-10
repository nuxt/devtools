<script setup lang="ts">
import Fuse from 'fuse.js'
import type { ServerRouteInfo } from '~/../../src/types'
import ServerTaskListItem from '~/components/ServerTaskListItem.vue'

definePageMeta({
  icon: 'codicon-run-all',
  title: 'Server Tasks',
  layout: 'full',
  category: 'server',
  show() {
    const serverTasks = useServerTasks()
    return () => {
      return Object.keys(serverTasks.value?.tasks ?? {}).length
        || serverTasks.value?.scheduledTasks !== false
    }
  },
})

const inputDefaultsDrawer = ref(false)

const serverTasks = useServerTasks()
const tasks = computed(() => Object.keys(serverTasks.value?.tasks ?? {}).map(taskKey => ({
  key: taskKey,
  ...serverTasks.value!.tasks[taskKey],
})))
// const currentServerRoute = useCurrentServeRoute()

const { view } = useDevToolsOptions('serverTasks')

// const selected = computed(() => {
//   if (!currentServerRoute.value && selectedRoute.value)
//     currentServerRoute.value = selectedRoute.value.filepath

//   const route = serverRoutes.value?.find(i => i.filepath === currentServerRoute.value)

//   if (currentServerRoute.value !== selectedRoute.value?.filepath && route)
//     selectedRoute.value = route
//   return route
// })

const search = ref('')
const fuse = computed(() => new Fuse(tasks.value, {
  keys: [
    'key',
    'description',
  ],
  shouldSort: true,
}))

const filtered = computed(() => {
  const result = !search.value
    ? tasks.value
    : fuse.value.search(search.value).map(i => i.item)
  return result
})

// const filterByCollection = computed(() => {
//   const collections: ServerRouteInfo[] = []

//   const addRouteToCollection = (collection: ServerRouteInfo, route: ServerRouteInfo) => {
//     collection.routes = collection.routes || []
//     collection.routes.push(route)
//   }

//   const findOrCreateCollection = (routeName: string, parentCollection?: ServerRouteInfo) => {
//     const existingCollection = parentCollection
//       ? parentCollection.routes?.find(r => r.route === routeName)
//       : collections.find(c => c.route === routeName)

//     if (existingCollection)
//       return existingCollection

//     const newCollection: ServerRouteInfo = {
//       route: routeName,
//       filepath: routeName.replace(/\W/g, '-').toLowerCase(),
//       type: 'collection',
//       routes: [],
//     }

//     if (parentCollection)
//       addRouteToCollection(parentCollection, newCollection)

//     else
//       collections.push(newCollection)

//     return newCollection
//   }

//   filtered.value.forEach((item) => {
//     let prefix: string | undefined
//     let parentCollection: ServerRouteInfo | undefined

//     const filepathParts = item.filepath.split('/')
//     const collectionNames = filepathParts.slice(filepathParts.indexOf('server') + 1)

//     if (item.type === 'runtime') {
//       collectionNames[0] = 'runtime'
//       const indexOfDist = filepathParts.indexOf('dist')
//       if (indexOfDist !== -1) {
//         prefix = filepathParts[indexOfDist - 1]
//         prefix && collectionNames.splice(1, 0, prefix)
//       }
//     }

//     if (collectionNames.length > 0 && collectionNames[collectionNames.length - 1].includes('.'))
//       collectionNames.pop()

//     collectionNames.forEach((collectionName) => {
//       parentCollection = findOrCreateCollection(collectionName, parentCollection)
//     })

//     if (parentCollection)
//       addRouteToCollection(parentCollection, item)
//     else
//       collections.push(item)
//   })

//   return collections
// })

function toggleView() {
  view.value = view.value === 'tree' ? 'list' : 'tree'
}

// function capitalize(str: string) {
//   return str.charAt(0).toUpperCase() + str.slice(1)
// }
</script>

<template>
  <NSplitPane storage-key="tab-server-tasks">
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
          <span op50>{{ tasks?.length }} tasks in total</span>
        </div>
      </NNavbar>

      <ServerTaskListItem
        v-for="item in filtered"
        :key="item.key"
        :item="item"
      />
    </template>
    <template #right>
      right
      <!-- <KeepAlive :max="10">
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
      </NPanelGrids> -->
    </template>
  </NSplitPane>
  <NDrawer v-model="inputDefaultsDrawer" auto-close max-w-xl min-w-xl @close="inputDefaultsDrawer = false">
    drawer
    <!-- <div>
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
    </div> -->
  </NDrawer>
</template>
