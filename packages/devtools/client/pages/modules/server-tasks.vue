<script setup lang="ts">
import Fuse from 'fuse.js'
import type { ServerTaskInfo } from '~/../../src/types'
import ServerTaskListItem from '~/components/ServerTaskListItem.vue'

definePageMeta({
  icon: 'codicon-run-all',
  title: 'Server Tasks',
  layout: 'full',
  category: 'server',
  show() {
    const { enabled } = useDevToolsOptions('serverTasks')
    const serverTasks = useServerTasks()
    return () => {
      if (!enabled.value)
        return false

      return Object.keys(serverTasks.value?.tasks ?? {}).length
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

const scheduledTasks = computed(() => {
  return Object
    .entries(serverTasks.value?.scheduledTasks ?? {})
    .map(([cron, tasks]) => ({ cron, tasks }))
})

const currentServerTask = useCurrentServerTask()

const { view, selectedTask, inputDefaults } = useDevToolsOptions('serverTasks')

const selected = computed(() => {
  if (!currentServerTask.value && selectedTask.value)
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    currentServerTask.value = selectedTask.value.name

  const task = tasks.value.find(i => i.name === currentServerTask.value)

  if (currentServerTask.value !== selectedTask.value?.name && task)
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
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
      handler: taskName,
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
</script>

<template>
  <NSplitPane storage-key="tab-server-tasks">
    <template #left>
      <NSplitPane horizontal storage-key="tab-server-tasks-split">
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
          <div px4 py2 border="b base">
            Cron groups
          </div>
          <div>
            <ul>
              <li v-for="cronCollection in scheduledTasks" :key="cronCollection.cron">
                <CronCollection :collection="cronCollection" />
              </li>
            </ul>
          </div>
        </template>
      </NSplitPane>
    </template>
    <template #right>
      <KeepAlive :max="10">
        <ServerTaskDetails
          v-if="selected"
          :key="selected.name"
          :task="selected"
          @open-default-input="inputDefaultsDrawer = true"
        />
      </KeepAlive>
      <NPanelGrids v-if="!selected">
        <NCard px6 py2>
          <span op75>Select a task to start</span>
        </NCard>
      </NPanelGrids>
    </template>
  </NSplitPane>
  <NDrawer v-model="inputDefaultsDrawer" auto-close max-w-xl min-w-xl @close="inputDefaultsDrawer = false">
    <div>
      <div p4 border="b base">
        <span text-lg>Default Inputs</span>
        <br>
        <span text-white op50>Merged as default for every task in DevTools</span>
      </div>
      <NSectionBlock
        :text="`Query ${inputDefaults.query.length ? `(${inputDefaults.query.length})` : ''}`"
        :padding="false"
        :icon="ServerRouteTabIcons.query"
      >
        <ServerRouteInputs v-model="inputDefaults.query" py0 :default="{ active: true, type: 'string' }" />
      </NSectionBlock>
    </div>
  </NDrawer>
</template>
