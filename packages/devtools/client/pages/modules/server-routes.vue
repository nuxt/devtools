<script setup lang="ts">
definePageMeta({
  icon: 'carbon-cloud',
  title: 'Server Routes',
  experimental: true,
})

// TODO: add selectable folder
const folders = ['api', 'routes']
const disabledFolders = ref<string[]>([])

const selectedRoute = ref()
const routes = computedAsync(() => {
  return rpc.getServerRouets([...disabledFolders.value])
})
const search = ref('')

const methods = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options', 'connect', 'trace']
const filtered = computed(() =>
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

const byFolder = computed(() => {
  const result: any = {}
  filtered.value?.forEach((item: any) => {
    const folder = item.url.split('/')[1]
    if (!result[folder])
      result[folder] = []
    result[folder].push(item)
  })
  return Object.keys(result).map(key => ({ key, value: result[key] }))
})

function methodColor(method: string) {
  const methods = {
    get: 'bg-blue-7',
    post: 'bg-green-7',
    put: 'bg-orange',
    delete: 'bg-red-7',
    patch: 'bg-yellow',
    head: 'bg-amber-7',
  } as any
  return methods[method.toLowerCase()] || 'bg-gray-700'
}
</script>

<template>
  <div h-full>
    <div grid="~ lg:cols-2" h-full of-hidden>
      <div overflow-auto>
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
          <div op50>
            <div flex justify-between>
              <div>
                <span v-if="search">{{ filtered.length }} matched · </span>
                <span>{{ routes?.length }} route in total</span>
              </div>
              <div flex>
                <Badge
                  v-for="folder in folders" :key="folder"
                  :class="disabledFolders.includes(folder) ? 'text-gray-100 bg-gray-400:10' : 'bg-green-400:10 text-green-400'"
                  title="Registered at runtime as a global component"
                  v-text="folder"
                />
              </div>
            </div>
          </div>
        </div>

        <NSectionBlock v-for="group, index in byFolder" :key="group.key" :text="group.key" :open="index === 0 ? true : false" :padding="false" :icon="group.key === 'api' ? 'carbon-api' : 'carbon:app-connectivity'">
          <div v-for="item in group.value" :key="item.path" flex items-center m-4 p-4 rounded-lg dark:hover-bg-dark-6 hover-bg-active :class="{ 'dark:bg-dark bg-light': selectedRoute === item }" @click="selectedRoute = item">
            <div flex items-center h-10 text-white w-20 justify-center rounded text-sm capitalize mr-2 :class="[methodColor(item.method)]">
              <span>{{ item.method }}</span>
            </div>
            <span>{{ item.url }}</span>
          </div>
        </NSectionBlock>
      </div>
      <div relative border-l border-dark pl-4 :class="{ 'flex items-center justify-center': !selectedRoute }">
        <div v-for="item in filtered" :key="item.path">
          <ServerRoute v-show="selectedRoute === item" :route="item" />
        </div>
        <div v-if="!selectedRoute" text-center>
          <NIcon w-48 h-48 icon="arcticons:fetch-rewards" />
          <h2 text-3xl>
            Select a route to fetch!
          </h2>
        </div>
      </div>
    </div>
  </div>
</template>
