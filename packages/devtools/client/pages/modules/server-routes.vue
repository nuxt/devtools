<script setup lang="ts">
definePageMeta({
  icon: 'carbon-cloud',
  title: 'Server Routes',
  experimental: true,
})

const route = useRoute()

const type = computed(() => route.query?.type as string | undefined)
const url = computed(() => route.query?.url as string | undefined)

const routes = computedAsync(() => {
  return rpc.getServerRoutes()
})

const selectedRoute = computed(() => routes.value?.find(i => i.url === url.value && i.method === type.value))
const search = ref('')

const methods = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options', 'connect', 'trace']
const filtered = computed(() =>
  // TODO: use fuse.js
  routes.value?.sort((a, b) =>
    a.url === b.url
      ? methods.indexOf(a.method) - methods.indexOf(b.method)
      : a.url.localeCompare(b.url),
  ).filter(item =>
    search.value.split(' ').every(word =>
      item.url.toLowerCase().includes(word.toLowerCase())
      || item.method.toLowerCase().includes(word.toLowerCase()),
    ),
  ),
)
</script>

<template>
  <PanelLeftRight>
    <template #left>
      <Navbar v-model:search="search" pb2>
        <div flex="~ gap1" op50 text-sm>
          <span v-if="search">{{ filtered.length }} matched · </span>
          <span>{{ routes?.length }} routes in total</span>
        </div>
      </Navbar>

      <template v-for="item of filtered" :key="item.id">
        <NuxtLink
          flex="~ gap-2" items-center hover-bg-active px2 py1
          :to="{
            query: {
              type: item.method,
              url: item.url,
            },
          }"
        >
          <div text-right w-12>
            <Badge
              :class="getRequestMethodClass(item.method)"
              title="updates available"
              v-text="item.method.toUpperCase()"
            />
          </div>
          <span text-sm font-mono>{{ item.url }}</span>
        </NuxtLink>
        <div x-divider />
      </template>
    </template>
    <template #right>
      <ServerRouteDetails
        v-if="selectedRoute"
        :key="selectedRoute.method + selectedRoute.url"
        :route="selectedRoute"
      />
      <span v-else h-full flex items-center op50 justify-center>
        Select a route to start
      </span>
    </template>
  </PanelLeftRight>
</template>
