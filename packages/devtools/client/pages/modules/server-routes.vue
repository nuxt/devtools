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

const showRuntime = ref(false)

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
          <NCheckbox v-model="showRuntime" n="primary sm">
            <span op75>Runtime routes</span>
          </NCheckbox>
        </div>
      </Navbar>

      <ServerRouteListItem
        v-for="item of filtered"
        :key="item.filepath"
        :item="item"
        :selected="selected"
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
