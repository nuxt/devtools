<script setup lang="ts">
import type { CodeSnippet, ServerRouteInfo } from '~/../src/types'

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
  statusCode: 200,
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

const openInEditor = useOpenInEditor()

const parsedRoute = computed(() => props.route.route?.split(/((?:\*\*)?:[\w_]+)/g))
const paramNames = computed(() => parsedRoute.value?.filter(i => i.startsWith(':') || i.startsWith('**:')) || [])

const routeMethod = ref(props.route.method || 'GET')
const routeParams = ref<RouteParam>({})
const routeBodies = ref<RouteParam[]>([{ key: '', value: '' }])
const routeQueries = ref<RouteParam[]>([{ key: '', value: '' }])
const routeHeaders = ref<RouteParam[]>([{ key: 'Content-Type', value: 'application/json' }])

const queriesCount = computed(() => routeQueries.value.filter(({ key }) => key).length)
const headersCount = computed(() => routeHeaders.value.filter(({ key }) => key).length)

const formattedBody = computed(() => {
  const obj: RouteParam = {}
  for (let i = 0; i < routeBodies.value.length; i++) {
    const { key, value } = routeBodies.value[i]
    obj[key] = value
  }
  return Object.keys(obj)[0] ? obj : null
})

const domain = computed(() => {
  let url = config.value?.devServer.url || 'http://localhost'
  if (url.charAt(url.length - 1) === '/')
    url = url.slice(0, -1)
  const port = config.value?.devServer.port || 3000
  const hasPort = url.includes(`:${port}`)
  return hasPort ? url : `${url}:${port}`
})

const finalPath = computed(() => {
  let query = new URLSearchParams(Object.fromEntries(routeQueries.value.filter(({ key }) => key).map(({ key, value }) => [key, value]))).toString()
  if (query)
    query = `?${query}`
  const path = (parsedRoute.value?.map((i) => {
    if (i.startsWith(':') || i.startsWith('**:'))
      return routeParams.value[i] || i
    return i
  }).join('') || '') + query

  let base = config.value?.app.baseURL || ''
  if (base === './' || base === '.')
    base = ''
  if (base.endsWith('/'))
    base = base.slice(0, -1)
  return (base + path)
})
const finalURL = computed(() => domain.value + finalPath.value)

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
      method: routeMethod.value.toUpperCase() as any,
      headers: Object.fromEntries(routeHeaders.value.filter(({ key, value }) => key && value).map(({ key, value }) => [key, value])),
      query: Object.fromEntries(routeQueries.value.filter(({ key, value }) => key && value).map(({ key, value }) => [key, value])),
      body: formattedBody.value,
      onResponse({ response: res }) {
        response.contentType = (res.headers.get('content-type') || '').toString().toLowerCase().trim()
        response.statusCode = res.status
      },
      onResponseError(res) {
        response.error = res.response._data
        response.data = res.response._data
      },
    })
  }
  catch (err: any) {

  }
  fetching.value = false
  fetchTime.value = Date.now() - start
}

const codeSnippets = computed(() => {
  const snippets: CodeSnippet[] = []

  const items: string[] = []
  const headers = routeHeaders.value
    .filter(({ key, value }) => key && value && !(key === 'Content-Type' && value === 'application/json'))
    .map(({ key, value }) => `  '${key}': '${value}'`).join(',\n')

  if (routeMethod.value.toUpperCase() !== 'GET')
    items.push(`method: '${routeMethod.value.toUpperCase()}'`)
  if (headers)
    items.push(`headers: {\n${headers}\n}`)
  if (formattedBody.value)
    items.push(`body: ${JSON.stringify(formattedBody.value, null, 2)}`)

  const options = items.length
    ? `, {
${items.join(',\n').split('\n').map(line => `  ${line}`).join('\n')}
}`
    : ''

  snippets.push({
    name: 'useFetch',
    lang: 'javascript',
    docs: ComposablesDocs.nuxt.useFetch,
    code: `const { data, pending, error, refresh } = useFetch('${finalPath.value}'${options})`,
  })

  snippets.push({
    name: '$fetch',
    lang: 'javascript',
    docs: ComposablesDocs.nuxt.$fetch,
    code: `await $fetch('${finalPath.value}'${options})`,
  })

  return snippets
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

const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD']
</script>

<template>
  <div h-full w-full flex="~ col">
    <div flex="~ col gap-2" flex-none p4 navbar-glass>
      <div flex="~ gap2">
        <NButton v-if="route.method" :class="getRequestMethodClass(routeMethod)" pointer-events-none tabindex="-1">
          {{ routeMethod.toUpperCase() }}
        </NButton>
        <NSelect v-else v-model="routeMethod" :class="getRequestMethodClass(routeMethod)">
          <option v-for="method of methods" :key="method" :class="getRequestMethodClass(method)">
            {{ method.toUpperCase() }}
          </option>
        </NSelect>
        <NTextInput
          :model-value="finalPath"
          disabled flex-auto font-mono
          p="x5 y2"
          n="primary xs"
        />
        <NButton n="primary solid" @click="fetchData">
          <NIcon icon="carbon:send" />
        </NButton>
      </div>
    </div>

    <div flex="~ gap2" w-full items-center px4 pb2 text-center text-sm border="b base">
      <NButton
        v-if="paramNames.length"
        :class="activeTab === 'params' ? 'text-primary n-primary' : 'border-transparent! shadow-none!'"
        @click="activeTab = 'params'"
      >
        <NIcon icon="i-carbon-text-selection" />
        Params ({{ paramNames.length }})
      </NButton>
      <NButton
        :class="activeTab === 'query' ? 'text-primary n-primary' : 'border-transparent! shadow-none!'"
        @click="activeTab = 'query'"
      >
        <NIcon icon="i-carbon-help" />
        Query {{ queriesCount ? `(${queriesCount})` : '' }}
      </NButton>
      <NButton
        v-if="routeMethod !== 'GET'"
        :class="activeTab === 'body' ? 'text-primary n-primary' : 'border-transparent! shadow-none!'"
        @click="activeTab = 'body'"
      >
        <NIcon icon="i-carbon-document" />
        Body
      </NButton>
      <NButton
        :class="activeTab === 'headers' ? 'text-primary n-primary' : 'border-transparent! shadow-none!'"
        @click="activeTab = 'headers'"
      >
        <NIcon icon="i-carbon-html-reference" />
        Headers {{ headersCount ? `(${headersCount})` : '' }}
      </NButton>
      <NButton
        :class="activeTab === 'snippet' ? 'text-primary n-primary' : 'border-transparent! shadow-none!'"
        @click="activeTab = 'snippet'"
      >
        <NIcon icon="carbon:code" />
        Snippets
      </NButton>
      <div flex-auto />
      <NButton
        icon="carbon-launch"
        @click="openInEditor(route.filepath)"
      >
        Open in Editor
      </NButton>
    </div>
    <div
      v-if="activeTab === 'params'"
      border="b base" items-center px4 py2
      grid="~ cols-[max-content_1fr] gap-2"
    >
      <template v-for="name in paramNames" :key="name">
        <div text-right font-mono>
          {{ name }}
        </div>
        <NTextInput
          v-model="routeParams[name]"
          :placeholder="name"
          flex-1
        />
      </template>
    </div>
    <div v-if="activeTab === 'snippet'" relative>
      <CodeSnippets
        v-if="codeSnippets.length"
        border="b base"
        :code-snippets="codeSnippets"
      />
    </div>
    <div v-else-if="currentParams" px4 py2 flex="~ col gap-2" border="b base">
      <div v-for="(item, index) in currentParams" :key="index" flex="~ gap-2" justify-around>
        <NTextInput v-model="item.key" placeholder="Key" flex-1 font-mono n="sm" />
        <NTextInput v-model="item.value" placeholder="Value" flex-1 font-mono n="sm" />
        <NButton n="red" @click="currentParams!.splice(index, 1)">
          <NIcon icon="carbon:delete" />
        </NButton>
      </div>
      <div>
        <NButton
          icon="carbon-add" n="sm primary"
          my1 px-3 @click="currentParams!.push({ key: '', value: '' })"
        >
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
    <NLoading v-else-if="fetching" z-10 flex-auto backdrop-blur>
      Fetching...
    </NLoading>
    <template v-else>
      <div border="b base" flex="~ gap2" items-center px4 py2>
        <div>Response</div>
        <Badge
          v-if="response.error"
          bg-red-400:10 text-red-400
        >
          Error
        </Badge>
        <Badge
          :class="{
            'bg-orange-400:10 text-orange-400': response.error,
            'bg-green-400:10 text-green-400': !response.error,
          }"
        >
          {{ response.statusCode }}
        </Badge>
        <code v-if="response.contentType" text-xs op50>
          {{ response.contentType }}
        </code>
        <div flex-auto />
        <div op50>
          Request finished in
        </div>
        <Badge bg-green-400:10 text-green-400>
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
