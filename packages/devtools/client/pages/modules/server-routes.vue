<script setup lang="ts">
import Fuse from 'fuse.js'

definePageMeta({
  icon: 'carbon-cloud',
  title: 'Server Routes',
  experimental: true,
  shouldShow() {
    return useServerRoutes().value?.length
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
        <div flex="~ gap1" op50 text-sm>
          <span v-if="search">{{ filtered.length }} matched · </span>
          <span>{{ serverRoutes?.length }} routes in total</span>
        </div>
      </Navbar>

      <template v-for="item of filtered" :key="item.id">
        <NuxtLink
          flex="~ gap-2" items-center px2 py1 hover-bg-active
          :to="{ query: { path: item.path } }"
        >
          <div text-right flex-none w-12>
            <Badge
              :class="getRequestMethodClass(item.method || '*')"
              title="updates available"
              v-text="(item.method || '*').toUpperCase()"
            />
          </div>
          <span text-sm font-mono>{{ item.route }}</span>
        </NuxtLink>
        <div x-divider />
      </template>
    </template>
    <template #right>
      <ServerRouteDetails
        v-if="selected"
        :key="selected.path"
        :route="selected"
      />
      <NPanelGrids v-else>
        <NCard py2 px6>
          <span op75>Select a route to start</span>
        </NCard>
      </NPanelGrids>
    </template>
  </PanelLeftRight>
</template>
