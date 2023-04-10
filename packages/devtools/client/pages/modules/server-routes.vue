<script setup lang="ts">
import Fuse from 'fuse.js'

definePageMeta({
  icon: 'carbon-cloud',
  title: 'Server Routes',
  experimental: true,
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

const selectedRoute = computed(() => serverRoutes.value
  ?.find(i => i.route === vueRoute.query?.route && i.method === vueRoute.query?.method),
)
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
          flex="~ gap-2" items-center hover-bg-active px2 py1
          :to="{
            query: {
              method: item.method,
              route: item.route,
            },
          }"
        >
          <div text-right flex-none w-12>
            <Badge
              :class="getRequestMethodClass(item.method || 'All')"
              title="updates available"
              v-text="(item.method || 'all').toUpperCase()"
            />
          </div>
          <span text-sm font-mono>{{ item.route }}</span>
        </NuxtLink>
        <div x-divider />
      </template>
    </template>
    <template #right>
      <ServerRouteDetails
        v-if="selectedRoute"
        :key="`${selectedRoute.method}${selectedRoute.route}`"
        :route="selectedRoute"
      />
      <span v-else items-center op50 h-full flex justify-center>
        Select a route to start
      </span>
    </template>
  </PanelLeftRight>
</template>
