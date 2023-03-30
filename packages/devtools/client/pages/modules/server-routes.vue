<script setup lang="ts">
definePageMeta({
  icon: 'carbon-cloud',
  title: 'Server Routes',
  experimental: true,
})

// TODO: add selectFolder method
const folders = ['api', 'routes']
const disabledFolders = ref<string[]>([])

const routes = computedAsync(() => {
  return rpc.getServerRouets([...disabledFolders.value])
})
const search = ref('')

const filtered = computed(() => {
  return routes.value?.sort((a, b) => {
    if (a.url === b.url) {
      const methods = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options', 'connect', 'trace']
      return methods.indexOf(a.method) - methods.indexOf(b.method)
    }
    return a.url.localeCompare(b.url)
  })
    .filter((item: any) => {
      const searchWords = search.value.split(' ')
      return searchWords.every((word) => {
        return item.url.toLowerCase().includes(word.toLowerCase()) || item.method.toLowerCase().includes(word.toLowerCase())
      })
    })
})

const methodColor = (method: string) => {
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
        <!-- TODO: add grid mode -->
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
    <NSectionBlock v-for="item in filtered" :key="item.path" :text="item.path" :open="false" :icon="item.type === 'api' ? 'carbon-api-1' : 'carbon:app-connectivity'">
      <template #text>
        <div flex items-center>
          <div flex items-center h-10 w-20 justify-center rounded text-sm capitalize mr-2 :class="[methodColor(item.method)]">
            <span>{{ item.method }}</span>
          </div>
          <span>{{ item.url }}</span>
        </div>
      </template>
      <ServerRoute :route="item" />
    </NSectionBlock>
  </div>
</template>
