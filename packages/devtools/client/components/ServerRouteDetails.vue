<script setup lang="ts">
import type { ServerRouteInfo } from '~/../src/types'

interface RouteParam {
  [key: string]: string
}

const props = defineProps({
  route: {
    type: Object as PropType<ServerRouteInfo>,
    required: true,
  },
})

const config = useServerConfig()
const response = ref()
const fetchTime = ref(0)
const fetching = ref(false)
const started = ref(false)

// parse url params like /api/:id
const parsedRoute = computed(() => {
  return props.route.route?.split(/((?:\*\*)?:[\w_]+)/g)
})
const paramNames = computed(() => {
  return parsedRoute.value?.filter(i => i.startsWith(':') || i.startsWith('**:')) || []
})

const method = computed(() => (props.route.method || 'GET').toUpperCase())
const routeParams = ref<RouteParam>({})
const routeBodies = ref<RouteParam[]>([{ key: '', value: '' }])
const routeQueries = ref<RouteParam[]>([{ key: '', value: '' }])
const routeHeaders = ref<RouteParam[]>([{ key: 'Content-Type', value: 'application/json' }])

const domain = computed(() => {
  return `http://localhost:${config.value?.devServer.port || 3000}`
})
const finalURL = computed(() => {
  return domain.value + (parsedRoute.value?.map((i) => {
    if (i.startsWith(':') || i.startsWith('**:'))
      return routeParams.value[i] || i
    return i
  }).join('') || '')
})

async function fetchData() {
  started.value = true
  fetching.value = true
  const start = Date.now()
  return await useLazyAsyncData(`${method.value}:${finalURL.value}`, () => $fetch(finalURL.value, {
    method: method.value.toUpperCase() as any,
    headers: Object.fromEntries(routeHeaders.value.filter(({ key, value }) => key && value).map(({ key, value }) => [key, value])),
    query: Object.fromEntries(routeQueries.value.filter(({ key, value }) => key && value).map(({ key, value }) => [key, value])),
    body: routeBodies.value.reduce((acc: any, cur: any) => {
      if (cur.key && cur.value)
        acc[cur.key] = cur.value
      return acc
    }, null),
  }))
    .then((res: any) => {
      response.value = res
      fetching.value = false
      fetchTime.value = Date.now() - start
    })
}

const rawFetchRequestCode = computed(() => {
  const headers = routeHeaders.value.filter(({ key, value }) => key && value).map(({ key, value }) => `  '${key}': '${value}'`).join(',\n')
  const body = routeBodies.value.reduce((acc: any, cur: any) => {
    if (cur.key && cur.value)
      acc[cur.key] = cur.value
    return acc
  }, {})

  const items: string[] = []

  if (method.value.toUpperCase() !== 'GET')
    items.push(`method: '${method.value.toUpperCase()}'`)

  let query = new URLSearchParams(Object.fromEntries(routeQueries.value.filter(({ key, value }) => key && value).map(({ key, value }) => [key, value]))).toString()
  if (query)
    query = `?${query}`

  if (headers)
    items.push(`headers: {\n${headers}\n}`)
  if (Object.keys(body).length)
    items.push(`body: ${JSON.stringify(body, null, 2)}`)

  return `await fetch('${finalURL.value + query}', {
${items.join(',\n').split('\n').map(line => `  ${line}`).join('\n')}
})`
})

const tabs = ['params', 'query', 'body', 'headers', 'fetch']
const activeTab = ref(tabs[0])

const currentParams = computed(() => {
  if (activeTab.value === 'query')
    return routeQueries.value
  if (activeTab.value === 'body')
    return routeBodies.value
  if (activeTab.value === 'headers')
    return routeHeaders.value
})
</script>

<template>
  <div h-full w-full flex="~ col">
    <div flex="~ col gap-2" p4 navbar-glass flex-none>
      <div flex="~ gap2">
        <NButton :class="getRequestMethodClass(method)" pointer-events-none tabindex="-1">
          {{ method.toUpperCase() }}
        </NButton>
        <NTextInput
          disabled
          :placeholder="finalURL"
          font-mono
          flex-auto
          p="x5 y2"
          n="primary xs"
        />
        <NButton n="primary solid" @click="fetchData">
          <NIcon icon="carbon:send" />
        </NButton>
      </div>
    </div>

    <div w-full p2 flex justify-around items-center text-center border="b base">
      <button
        v-for="tab in tabs" :key="tab"
        :class="{ 'text-primary': activeTab === tab }"
        capitalize flex-1 text-sm
        @click="activeTab = tab"
      >
        <!-- TODO: icon -->
        <!-- TODO: counter of items -->
        {{ tab }}
      </button>
    </div>
    <div v-if="activeTab === 'params'" justify-around border="b base" px4 py2>
      <div v-if="!paramNames.length" op50 italic>
        No params
      </div>
      <template v-else>
        <div v-for="name in paramNames" :key="name" flex="~ gap-2" items-center>
          <div font-mono text-right w-25>
            {{ name }}
          </div>
          <NTextInput
            v-model="routeParams[name]"
            :placeholder="name"
            flex-1
          />
        </div>
      </template>
    </div>
    <template v-if="activeTab === 'fetch'">
      <NCodeBlock
        p2 border="b base"
        :code="rawFetchRequestCode"
        lang="js"
      />
    </template>
    <div v-else-if="currentParams" px4 py2 flex="~ col gap-2" border="b base">
      <div v-for="(item, index) in currentParams" :key="index" flex="~ gap-2" justify-around>
        <NTextInput v-model="item.key" placeholder="Key" flex-1 font-mono n="sm" />
        <NTextInput v-model="item.value" placeholder="Value" flex-1 font-mono n="sm" />
        <NButton n="red" @click="currentParams!.splice(index, 1)">
          <NIcon icon="carbon:delete" />
        </NButton>
      </div>
      <div>
        <NButton icon="carbon:add" @click="currentParams!.push({ key: '', value: '' })">
          Add
        </NButton>
      </div>
    </div>

    <div v-if="!started" flex="~ col gap2" flex-auto items-center justify-center>
      <div op50>
        Click the button below to send a request to the server.
      </div>
      <NButton n="primary" @click="fetchData">
        <NIcon icon="carbon:send" />
        Send request
      </NButton>
    </div>
    <NLoading v-else-if="fetching" flex-auto z-10 backdrop-blur>
      Fetching...
    </NLoading>
    <template v-else>
      <div px4 py2 border="b base" flex="~ gap2">
        <div>Response</div>
        <div flex-auto />
        <div op50>
          Request finished in
        </div>
        <Badge text-green-400 bg-green-400:10>
          {{ fetchTime }} ms
        </Badge>
      </div>
      <!-- Rich response data -->
      <NCodeBlock
        flex-auto overflow-auto py-2
        :code="response ? JSON.stringify(response, null, 2) : ''"
        lang="json"
      />
    </template>
  </div>
</template>
