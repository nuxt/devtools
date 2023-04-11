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

const response = reactive({
  contentType: 'text/plain',
  data: '' as any,
  error: undefined as Error | undefined,
})

const responseLang = computed(() => {
  if (response.contentType.includes('application/json'))
    return 'json'
  if (response.contentType.includes('text/html'))
    return 'html'
  if (response.contentType.includes('text/css'))
    return 'css'
  if (response.contentType.includes('text/javascript'))
    return 'javascript'
  if (response.contentType.includes('text/xml') || response.contentType.includes('application/xml'))
    return 'xml'
  return 'text'
})

const responseContent = computed(() => {
  if (responseLang.value === 'json')
    return JSON.stringify(response.data, null, 2)
  return response.data
})

const fetchTime = ref(0)
const fetching = ref(false)
const started = ref(false)

const parsedRoute = computed(() => props.route.route?.split(/((?:\*\*)?:[\w_]+)/g))
const paramNames = computed(() => parsedRoute.value?.filter(i => i.startsWith(':') || i.startsWith('**:')) || [])

const method = computed(() => (props.route.method || 'GET').toUpperCase())
const routeParams = ref<RouteParam>({})
const routeBodies = ref<RouteParam[]>([{ key: '', value: '' }])
const routeQueries = ref<RouteParam[]>([{ key: '', value: '' }])
const routeHeaders = ref<RouteParam[]>([{ key: 'Content-Type', value: 'application/json' }])

const queriesCount = computed(() => routeQueries.value.filter(({ key }) => key).length)
const headersCount = computed(() => routeHeaders.value.filter(({ key }) => key).length)

const domain = computed(() => `http://localhost:${config.value?.devServer.port || 3000}`)
const finalURL = computed(() => {
  let query = new URLSearchParams(Object.fromEntries(routeQueries.value.filter(({ key }) => key).map(({ key, value }) => [key, value]))).toString()
  if (query)
    query = `?${query}`

  return domain.value + (parsedRoute.value?.map((i) => {
    if (i.startsWith(':') || i.startsWith('**:'))
      return routeParams.value[i] || i
    return i
  }).join('') || '') + query
})

async function fetchData() {
  started.value = true
  fetching.value = true
  Object.assign(response, {
    lang: 'text',
    contentType: '',
    data: '',
    content: '',
    error: undefined,
  })

  const start = Date.now()
  try {
    response.data = await $fetch(finalURL.value, {
      method: method.value.toUpperCase() as any,
      headers: Object.fromEntries(routeHeaders.value.filter(({ key, value }) => key && value).map(({ key, value }) => [key, value])),
      query: Object.fromEntries(routeQueries.value.filter(({ key, value }) => key && value).map(({ key, value }) => [key, value])),
      body: routeBodies.value.reduce((acc: any, cur: any) => {
        if (cur.key && cur.value)
          acc[cur.key] = cur.value
        return acc
      }, null),
      onResponse({ response: res }) {
        response.contentType = (res.headers.get('content-type') || '').toString().toLowerCase().trim()
      },
      onResponseError({ error }) {
        console.error(error)
        response.error = error
        response.data = error?.message || error?.toString?.() || 'Unknown error'
      },
    })
  }
  catch (err: any) {

  }
  fetching.value = false
  fetchTime.value = Date.now() - start
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

  if (headers)
    items.push(`headers: {\n${headers}\n}`)
  if (Object.keys(body).length)
    items.push(`body: ${JSON.stringify(body, null, 2)}`)

  return `await fetch('${finalURL.value}', {
${items.join(',\n').split('\n').map(line => `  ${line}`).join('\n')}
})`
})

const activeTab = ref(paramNames.value.length ? 'params' : 'query')

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
    <div flex="~ col gap-2" flex-none p4 navbar-glass>
      <div flex="~ gap2">
        <!-- TODO: when route.method is not defined, make this a dropdown -->
        <NButton :class="getRequestMethodClass(method)" pointer-events-none tabindex="-1">
          {{ method.toUpperCase() }}
        </NButton>
        <NTextInput

          :placeholder="finalURL"

          flex-auto disabled font-mono
          p="x5 y2"
          n="primary xs"
        />
        <NButton n="primary solid" @click="fetchData">
          <NIcon icon="carbon:send" />
        </NButton>
      </div>
    </div>

    <div flex="~ gap2" w-full items-center text-center text-sm px4 pb2 border="b base">
      <NButton
        v-if="paramNames.length"
        :class="activeTab === 'params' ? 'text-primary n-primary' : 'border-transparent!'"
        @click="activeTab = 'params'"
      >
        <NIcon icon="i-carbon-text-selection" />
        Params ({{ paramNames.length }})
      </NButton>
      <NButton
        :class="activeTab === 'query' ? 'text-primary n-primary' : 'border-transparent!'"
        @click="activeTab = 'query'"
      >
        <NIcon icon="i-carbon-help" />
        Query {{ queriesCount ? `(${queriesCount})` : '' }}
      </NButton>
      <NButton
        v-if="method !== 'GET'"
        :class="activeTab === 'body' ? 'text-primary n-primary' : 'border-transparent!'"
        @click="activeTab = 'body'"
      >
        <NIcon icon="i-carbon-document" />
        Body
      </NButton>
      <NButton
        :class="activeTab === 'headers' ? 'text-primary n-primary' : 'border-transparent!'"
        @click="activeTab = 'headers'"
      >
        <NIcon icon="i-carbon-html-reference" />
        Headers {{ headersCount ? `(${headersCount})` : '' }}
      </NButton>
      <NButton
        :class="activeTab === 'snippet' ? 'text-primary n-primary' : 'border-transparent!'"
        @click="activeTab = 'snippet'"
      >
        <NIcon icon="carbon:code" />
        Fetch Snippet
      </NButton>
    </div>
    <div
      v-if="activeTab === 'params'"
      border="b base" px4 items-center py2
      grid="~ cols-[max-content_1fr] gap-2"
    >
      <template v-for="name in paramNames" :key="name">
        <div font-mono text-right>
          {{ name }}
        </div>
        <NTextInput
          v-model="routeParams[name]"
          :placeholder="name"
          flex-1
        />
      </template>
    </div>
    <template v-if="activeTab === 'snippet'">
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

    <NPanelGrids v-if="!started">
      <NButton n="primary" @click="fetchData">
        <NIcon icon="carbon:send" />
        Send request
      </NButton>
    </NPanelGrids>
    <NLoading v-else-if="fetching" flex-auto z-10 backdrop-blur>
      Fetching...
    </NLoading>
    <template v-else>
      <div px4 py2 border="b base" flex="~ gap2" items-center>
        <div>Response</div>
        <Badge
          v-if="response.error"
          text-red-400 bg-red-400:10
        >
          Error
        </Badge>
        <code v-if="response.contentType" op50 text-xs>
          {{ response.contentType }}
        </code>
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
        :code="responseContent"
        :lang="responseLang"
      />
    </template>
  </div>
</template>
