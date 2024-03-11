<script setup lang="ts">
import Fuse from 'fuse.js'
import type { ServerTaskInfo } from '../../../src/types/tasks'
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
const tasks = computed<ServerTaskInfo[]>(() => Object.keys(serverTasks.value?.tasks ?? {}).map(taskKey => ({
  name: taskKey,
  ...serverTasks.value!.tasks[taskKey],
  type: 'task',
})))
const currentServerTask = useCurrentServerTask()

const { view, selectedTask } = useDevToolsOptions('serverTasks')

const selected = computed(() => {
  if (!currentServerTask.value && selectedTask.value)
    currentServerTask.value = selectedTask.value.name

  const task = tasks.value.find(i => i.name === currentServerTask.value)

  if (currentServerTask.value !== selectedTask.value?.name && task)
    selectedTask.value = task
  return task
})

const search = ref('')
const fuse = computed(() => new Fuse(tasks.value, {
  keys: [
    'key',
    'description',
  ],
  shouldSort: true,
}))

const filtered = computed(() => {
  const result = search.value
    ? fuse.value.search(search.value).map(i => i.item)
    : tasks.value
  return result
})

const filterByCollection = computed(() => {
  const collections: ServerTaskInfo[] = []

  const addTaskToCollection = (collection: ServerTaskInfo, route: ServerTaskInfo) => {
    collection.tasks ||= []
    collection.tasks.push(route)
  }

  const findOrCreateCollection = (taskName: string, parentCollection?: ServerTaskInfo) => {
    const existingCollection = parentCollection
      ? parentCollection.tasks?.find(t => t.name === taskName)
      : collections.find(c => c.name === taskName)

    if (existingCollection) {
      return {
        ...existingCollection,
        type: 'collection',
      } satisfies ServerTaskInfo
    }

    const newCollection: ServerTaskInfo = {
      name: taskName,
      description: '',
      type: 'collection',
      tasks: [],
    }

    if (parentCollection)
      addTaskToCollection(parentCollection, newCollection)

    else
      collections.push(newCollection)

    return newCollection
  }

  filtered.value.forEach((item) => {
    let parentCollection: ServerTaskInfo | undefined
    const taskItem = {
      ...item,
      type: 'task',
    } satisfies ServerTaskInfo

    const taskParts = item.name.split(':')
    const collectionNames = taskParts.concat()

    if (collectionNames.length > 0 && collectionNames[collectionNames.length - 1].includes('.'))
      collectionNames.pop()

    collectionNames.forEach((collectionName) => {
      parentCollection = findOrCreateCollection(collectionName, parentCollection)
    })

    if (parentCollection)
      addTaskToCollection(parentCollection, taskItem)
    else
      collections.push(taskItem)
  })

  return collections
})

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
        v-for="item in view === 'tree' ? filterByCollection : filtered"
        :key="item.name"
        :item="item"
      />
    </template>
    <template #right>
      <!-- <ServerRouteDetails
        v-if="selected"
        :key="selected.filepath"
        :route="selected"
        @open-default-input="inputDefaultsDrawer = true"
      /> -->
      <KeepAlive :max="10">
        <pre v-if="selected">{{ selected }}</pre>
      </KeepAlive>
      <NPanelGrids v-if="!selected">
        <NCard px6 py2>
          <span op75>Select a task to start</span>
        </NCard>
      </NPanelGrids>
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
