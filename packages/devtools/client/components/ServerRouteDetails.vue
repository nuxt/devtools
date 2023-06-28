<script setup lang="ts">
import type { CodeSnippet, ServerRouteInfo } from '~/../src/types'

const props = defineProps<{
  route: ServerRouteInfo
}>()

const currentRoute = useRoute()
const config = useServerConfig()

// TODO: use storage options to cache responses
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
  if (response.contentType.includes('image') || response.contentType.includes('video'))
    return 'media'
  if (response.contentType.includes('text/xml') || response.contentType.includes('application/xml'))
    return 'xml'
  return 'text'
})

const responseContent = computed(() => {
  if (responseLang.value === 'json')
    return JSON.stringify(response.data, null, 2)
  if (responseLang.value === 'media') {
    const blob = new Blob([response.data], { type: response.contentType })
    return URL.createObjectURL(blob)
  }
  return response.data
})

const fetchTime = ref(0)
const fetching = ref(false)
const started = ref(false)

const openInEditor = useOpenInEditor()

const parsedRoute = computed(() => props.route.route?.split(/((?:\*\*)?:[\w_]+)/g))
const paramNames = computed(() => parsedRoute.value?.filter(i => i.startsWith(':') || i.startsWith('**:')) || [])

const routeMethod = ref(props.route.method || 'GET')
const routeParams = ref<{ [key: string]: string }>({})
// TODO: add type to switch between json and input
const routeInputs = reactive({
  query: [{ key: '', value: '' }],
  body: [{ key: '', value: '' }],
  headers: [{ key: 'Content-Type', value: 'application/json' }],
})

const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD']
// https://github.com/unjs/h3/blob/main/src/utils/body.ts#L12
const bodyPayloadMethods = ['PATCH', 'POST', 'PUT', 'DELETE']
const hasBody = computed(() => bodyPayloadMethods.includes(routeMethod.value.toUpperCase()))

const activeTab = ref(currentRoute.query.tab ? currentRoute.query.tab : paramNames.value.length ? 'params' : 'query')

// TODO: fix routeInputs[activeTab.value] type
type RouteInputs = keyof typeof routeInputs
const currentParams = computed({
  get: () => routeInputs[activeTab.value as RouteInputs],
  set: (value) => {
    routeInputs[activeTab.value as RouteInputs] = value
  },
})

// TODO: add global inputs
const parsedQuery = computed(() => {
  return {
    ...parseInputs(routeInputs.query),
  }
})
const parsedHeader = computed(() => {
  return {
    ...parseInputs(routeInputs.headers),
  }
})
const parsedBody = computed(() => {
  return hasBody.value
    ? {
        ...parseInputs(routeInputs.body),
      }
    : undefined
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
  let query = new URLSearchParams(parsedQuery.value).toString()
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

function parseInputs(inputs: any[]) {
  const formatted = Object.fromEntries(
    inputs.filter(({ key, value }) => key && value).map(({ key, value }) => [key, value]),
  )
  return Object.entries(formatted).length ? formatted : undefined
}

async function fetchData() {
  started.value = true
  fetching.value = true
  Object.assign(response, {
    lang: 'text',
    contentType: '',
    data: '',
    error: undefined,
  })

  const start = Date.now()
  try {
    response.data = await $fetch(finalURL.value, {
      method: routeMethod.value.toUpperCase() as any,
      headers: parsedHeader.value,
      query: parsedQuery.value,
      body: parsedBody.value,
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
  const headers = routeInputs.headers
    .filter(({ key, value }) => key && value && !(key === 'Content-Type' && value === 'application/json'))
    .map(({ key, value }) => `  '${key}': '${value}'`).join(',\n')

  if (routeMethod.value.toUpperCase() !== 'GET')
    items.push(`method: '${routeMethod.value.toUpperCase()}'`)
  if (headers)
    items.push(`headers: {\n${headers}\n}`)
  if (parsedBody.value)
    items.push(`body: ${JSON.stringify(parsedBody.value, null, 2)}`)

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

const tabs = computed(() => {
  const items = []
  if (paramNames.value.length) {
    items.push({
      name: 'Params',
      slug: 'params',
      icon: 'carbon-text-selection',
      length: paramNames.value.length,
    })
  }
  items.push({
    name: 'Query',
    slug: 'query',
    icon: 'carbon-help',
    length: routeInputs.query.length,
  })
  if (hasBody.value) {
    items.push({
      name: 'Body',
      slug: 'body',
      icon: 'carbon-document',
      length: routeInputs.body.length,
    })
  }
  items.push({
    name: 'Headers',
    slug: 'headers',
    icon: 'carbon-html-reference',
    length: routeInputs.headers.length,
  })
  items.push({
    name: 'Snippets',
    slug: 'snippet',
    icon: 'carbon-code',
  })
  return items
})
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
        v-for="tab of tabs"
        :key="tab.slug"
        :class="activeTab === tab.slug ? 'text-primary n-primary' : 'border-transparent shadow-none'"
        @click="activeTab = tab.slug"
      >
        <NIcon :icon="tab.icon" />
        {{ tab.name }} {{ tab?.length ? `(${tab.length})` : '' }}
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
        v-if="responseLang !== 'media'"
        flex-auto overflow-auto py-2
        :code="responseContent"
        :lang="responseLang"
      />
      <div v-else flex-auto overflow-auto p4>
        <div border="~ base" rounded>
          <img v-if="response.contentType.includes('image')" rounded :src="responseContent">
          <video v-else controls rounded>
            <source :src="responseContent" type="video/mp4">
          </video>
        </div>
      </div>
    </template>
  </div>
</template>
