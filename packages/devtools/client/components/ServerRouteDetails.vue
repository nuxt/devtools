<script setup lang="ts">
import JsonEditorVue from 'json-editor-vue'

import type { CodeSnippet, ServerRouteInfo } from '~/../src/types'

const props = defineProps({
  route: {
    type: Object as PropType<ServerRouteInfo>,
    required: true,
  },
})

const currentRoute = useRoute()

// TODO: move these
interface RouteInput {
  key: string
  value: any
  type?: string
}

interface RouteInputs {
  body: RouteInput[]
  query: RouteInput[]
  headers: RouteInput[]
}

interface RouteParam {
  [key: string]: string | boolean | number
}

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

const inputTabs = ['inputs', 'json']
const activeInputTab = ref(inputTabs[0])
// TODO: add better support for file, color, etc
const inputTypes = ['text', 'number', 'boolean', 'file', 'date', 'time', 'datetime-local']

const routeMethod = ref(props.route.method || 'GET')
const routeParams = ref<RouteParam>({})
const routeInputs = reactive<RouteInputs>({
  query: [{ key: '', value: '' }],
  body: [{ key: '', value: '' }],
  headers: [{ key: 'Content-Type', value: 'application/json' }],
})

const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD']
// https://github.com/unjs/h3/blob/main/src/utils/body.ts#L12
const bodyPayloadMethods = ['PATCH', 'POST', 'PUT', 'DELETE']
const hasBody = computed(() => bodyPayloadMethods.includes(routeMethod.value.toUpperCase()))

const parsedQuery = computed(() => parseInputs(routeInputs.query))
const parsedHeader = computed(() => parseInputs(routeInputs.headers))
const parsedBody = computed(() => hasBody.value ? parseInputs(routeInputs.body) : undefined)

function onFileInputChange(index: number, event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      routeInputs.body[index].value = reader.result as any
    }
  }
}

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

function parseInputs(inputs: RouteParam[]) {
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
    content: '',
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
  const tabs = []

  if (paramNames.value.length) {
    tabs.push({
      name: 'params',
      label: 'Params',
      icon: 'carbon-text-selection',
      length: paramNames.value.length,
    })
  }

  tabs.push({
    name: 'query',
    label: 'Query',
    icon: 'carbon-help',
    length: routeInputs.query.length,
  })

  if (hasBody.value) {
    tabs.push({
      name: 'body',
      label: 'Body',
      icon: 'carbon-document',
      length: routeInputs.body.length,
    })
  }

  tabs.push({
    name: 'headers',
    label: 'Headers',
    icon: 'carbon-html-reference',
    length: routeInputs.headers.length,
  })

  tabs.push({
    name: 'snippet',
    label: 'Snippet',
    icon: 'carbon-code',
  })

  return tabs
})

const activeTab = ref(currentRoute.query.tab ? currentRoute.query.tab : paramNames.value.length ? 'params' : 'query')

// TODO: fix routeInputs[activeTab.value] type error
const currentParams = computed<RouteInput[]>({
  get: () => routeInputs[activeTab.value],
  set: (value) => {
    routeInputs[activeTab.value] = value
  },
})
watchEffect(() => {
  if (activeInputTab.value === 'json') {
    if (typeof routeInputs[activeTab.value] === 'string')
      routeInputs[activeTab.value] = JSON.parse(routeInputs[activeTab.value])
    routeInputs[activeTab.value]?.forEach((input) => {
      delete input.type
    })
  }
  if (activeInputTab.value === 'inputs') {
    routeInputs[activeTab.value]?.forEach((input) => {
      input.type = 'text'
    })
  }
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
        :key="tab.label"
        :to="{ query: { ...$route.query, tab: tab.name } }"
        :class="activeTab === tab.name ? 'text-primary n-primary' : 'border-transparent! shadow-none!'"
        @click="activeTab = tab.name"
      >
        <NIcon :icon="tab.icon" />
        {{ tab.label }} {{ tab?.length ? `(${tab.length})` : '' }}
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
    <template v-else-if="currentParams">
      <NTabs v-model="activeInputTab" :tabs="inputTabs">
        <template v-if="activeInputTab === 'inputs'">
          <div v-for="(item, index) in currentParams" :key="index" flex="~ gap-2" justify-around>
            <NTextInput v-model="item.key" placeholder="Key" flex-1 font-mono n="sm" />
            <template v-if="item.type">
              <NTextInput v-if="item.type === 'file'" type="file" @change="onFileInputChange(index, $event)" />
              <div v-else-if="item.type === 'boolean'" ml2 flex>
                <NCheckbox v-model="item.value" placeholder="Value" n="green lg" />
              </div>
              <NTextInput v-else v-model="item.value" :type="item.type" placeholder="Value" flex-1 font-mono n="sm" />
            </template>
            <NTextInput v-else v-model="item.value" placeholder="Value" flex-1 font-mono n="sm" />
            <NSelect v-if="item?.type" v-model="item.type" n="sm">
              <option v-for="inType of inputTypes" :key="inType" :value="inType">
                {{ inType }}
              </option>
            </NSelect>
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
        </template>
        <div v-else-if="activeInputTab === 'json'">
          <JsonEditorVue
            v-model="currentParams"
            :class="[$colorMode.value === 'dark' ? 'jse-theme-dark' : 'light']"
            class="json-editor-vue h-full of-auto text-sm outline-none"
            v-bind="$attrs" mode="text" :navigation-bar="false" :indentation="2" :tab-size="2"
          />
        </div>
      </NTabs>
    </template>
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
