<script setup lang="ts">
definePageMeta({
  icon: 'carbon-cloud',
  title: 'Server Routes',
  experimental: true,
})

// TODO: add selectable folder
const folders = ['api', 'routes']
const disabledFolders = ref<string[]>([])

const route = useRoute()

const type = computed(() => route.query?.type as string | undefined)
const url = computed(() => route.query?.url as string | undefined)

const routes = computedAsync(() => {
  return rpc.getServerRoutes([...disabledFolders.value])
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

function methodColor(method: string) {
  const methods = {
    get: 'bg-green-400:10 text-green-400',
    post: 'bg-blue-400:10 text-blue-400',
    put: 'bg-orange-400:10 text-orange-400',
    delete: 'bg-red-400:10 text-red-400',
    patch: 'bg-purple-400:10 text-purple-400',
    head: 'bg-teal-400:10 text-teal-400',
  } as any
  return methods[method.toLowerCase()] || 'bg-gray-400:10 text-gray-400'
}
</script>

<template>
  <PanelLeftRight>
    <template #left>
      <div flex="~ col gap-2" border="b base" p4 navbar-glass flex-1 pb2>
        <div flex="~ gap4">
          <NTextInput
            v-model="search"
            placeholder="Search..."
            icon="carbon-search"
            flex-auto
            p="x5 y2"
            n="primary"
          />
        </div>
        <div flex="~ gap1" op50 text-sm>
          <span v-if="search">{{ filtered.length }} matched · </span>
          <span>{{ routes?.length }} routes in total</span>
        </div>
      </div>

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
          <div w-12 text-right>
            <Badge
              :class="methodColor(item.method)"
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
      <ServerRouteDetails v-if="selectedRoute" :route="selectedRoute" />
      <span v-else h-full flex items-center op50 justify-center>
        Select a route to start
      </span>
    </template>
  </PanelLeftRight>
</template>
