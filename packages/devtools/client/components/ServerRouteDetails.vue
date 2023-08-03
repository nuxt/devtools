<script setup lang="ts">
import JsonEditorVue from 'json-editor-vue'
import { createReusableTemplate } from '@vueuse/core'
import type { CodeSnippet, ServerRouteInfo, ServerRouteInput } from '~/../src/types'

const props = defineProps<{
  route: ServerRouteInfo
}>()

const emit = defineEmits<{
  (event: 'open-default-input'): void
}>()

const [DefineDefaultInputs, UseDefaultInputs] = createReusableTemplate()

const config = useServerConfig()

const response = reactive({
  contentType: 'text/plain',
  data: '' as any,
  statusCode: 200,
  error: undefined as Error | undefined,
  fetchTime: 0,
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
  if (response.contentType.includes('application/pdf'))
    return 'pdf'
  return 'text'
})

const responseContent = computed(() => {
  if (responseLang.value === 'json')
    return JSON.stringify(response.data, null, 2)
  if (responseLang.value === 'media' || responseLang.value === 'pdf') {
    const blob = new Blob([response.data], { type: response.contentType })
    return URL.createObjectURL(blob)
  }
  return response.data
})

const fetching = ref(false)
const started = ref(false)

const openInEditor = useOpenInEditor()

const parsedRoute = computed(() => props.route.route?.split(/((?:\*\*)?:[\w_]+)/g))
const paramNames = computed(() => parsedRoute.value?.filter(i => i.startsWith(':') || i.startsWith('**:')) || [])

const routeMethod = ref(props.route.method || 'GET')
const routeParams = ref<{ [key: string]: string }>({})
const routeInputs = reactive({
  query: [{ key: '', value: '', type: 'string' }] as ServerRouteInput[],
  body: [{ key: '', value: '', type: 'string' }] as ServerRouteInput[],
  headers: [{ key: 'Content-Type', value: 'application/json', type: 'string' }] as ServerRouteInput[],
})
const routeInputBodyJSON = ref({})
const { inputDefaults } = useDevToolsOptions('serverRoutes')

const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD']
// https://github.com/unjs/h3/blob/main/src/utils/body.ts#L19
const bodyPayloadMethods = ['PATCH', 'POST', 'PUT', 'DELETE']
const hasBody = computed(() => bodyPayloadMethods.includes(routeMethod.value.toUpperCase()))

const activeTab = ref(paramNames.value.length ? 'params' : 'query')

const tabInputs = ['input', 'json']
const selectedTabInput = ref(tabInputs[0])

// TODO: fix routeInputs[activeTab.value] type
type RouteInputs = keyof typeof routeInputs
const currentParams = computed({
  get: () => routeInputs[activeTab.value as RouteInputs],
  set: (value: any) => {
    routeInputs[activeTab.value as RouteInputs] = value
  },
})

const parsedQuery = computed(() => {
  return {
    ...parseInputs(inputDefaults.value.query),
    ...parseInputs(routeInputs.query),
  }
})
const parsedHeader = computed(() => {
  return {
    ...parseInputs(inputDefaults.value.headers),
    ...parseInputs(routeInputs.headers),
  }
})
const parsedBody = computed(() => {
  return hasBody.value
    ? selectedTabInput.value === 'json'
      ? {
          ...parseInputs(inputDefaults.value.body),
          ...routeInputBodyJSON.value,
        }
      : {
          ...parseInputs(inputDefaults.value.body),
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
    inputs.filter(({ key, value }) => key && value !== undefined).map(({ key, value }) => [key, value]),
  )
  return Object.entries(formatted).length ? formatted : undefined
}

async function fetchData() {
  started.value = true
  fetching.value = true

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
        response.error = undefined
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
  response.fetchTime = Date.now() - start
}

const codeSnippets = computed(() => {
  const snippets: CodeSnippet[] = []

  const items: string[] = []
  const headers = Object.entries(parsedHeader.value)
    .filter(([key, value]) => key && value && !(key === 'Content-Type' && value === 'application/json'))
    .map(([key, value]) => `  '${key}': '${value}'`).join(',\n')

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
      length: paramNames.value.length,
    })
  }
  items.push({
    name: 'Query',
    slug: 'query',
    length: routeInputs.query.length,
  })
  if (hasBody.value) {
    items.push({
      name: 'Body',
      slug: 'body',
      length: routeInputs.body.length,
    })
  }
  items.push({
    name: 'Headers',
    slug: 'headers',
    length: routeInputs.headers.length,
  })
  items.push({
    name: 'Cookies',
    slug: 'cookies',
  })
  items.push({
    name: 'Snippets',
    slug: 'snippet',
  })
  return items
})

const cookies = ref(getCookies())

function getCookies() {
  return document.cookie.split('; ').map((i) => {
    const [key, value] = i.split('=')
    return { key, value }
  })
}

const newCookie = reactive({ key: '', value: '' })

function updateCookie(key: string, value: any) {
  if (!key)
    return
  const exist = cookies.value.find(cookie => cookie.key === key)
  const cookie = useCookie(key)
  if (exist !== undefined) {
    if (value === undefined)
      cookies.value = cookies.value.filter(cookie => cookie.key !== key)
  }
  else {
    cookies.value.push({ key, value })
    newCookie.key = ''
    newCookie.value = ''
  }
  cookie.value = value
}

watchEffect(() => {
  if (selectedTabInput.value === 'json') {
    if (typeof routeInputBodyJSON.value === 'string')
      routeInputBodyJSON.value = JSON.parse(routeInputBodyJSON.value)
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

    <div flex="~ gap2 wrap" w-full items-center px4 pb2 text-center text-sm border="b base">
      <NButton
        v-for="tab of tabs"
        :key="tab.slug"
        :class="activeTab === tab.slug ? 'text-primary n-primary' : 'border-transparent shadow-none'"
        @click="activeTab = tab.slug"
      >
        <NIcon :icon="ServerRouteTabIcons[tab.slug]" />
        {{ tab.name }}
        {{ tab?.length ? `(${tab.length})` : '' }}
        <span>
          {{ inputDefaults[tab.slug]?.length ? `(${inputDefaults[tab.slug].length})` : '' }}
        </span>
      </NButton>
      <div flex-auto />
      <NButton
        v-tooltip="'Open in Editor'"
        @click="openInEditor(route.filepath)"
      >
        <NIcon icon="carbon-launch" />
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
    <div
      v-if="activeTab === 'cookies'"
      border="b base" p4 flex="~ col gap-4" font-mono
    >
      <div v-for="cookie in cookies" :key="cookie.key" flex="~ gap-4 items-center">
        <NTextInput
          placeholder="Key..."
          :model-value="cookie.key"
          disabled op-70
        />
        <NTextInput
          placeholder="Value..."
          :model-value="cookie.value"
          flex-1 n="primary"
          @input="updateCookie(cookie.key, $event.target?.value)"
        />
        <NButton title="Delete" n="red" @click="updateCookie(cookie.key, undefined)">
          <NIcon icon="i-carbon-delete" />
        </NButton>
      </div>
      <div flex="~ gap-4">
        <NTextInput
          v-model="newCookie.key"
          placeholder="Key"
          n="primary" flex-1
        />
        <NTextInput
          v-model="newCookie.value"
          placeholder="Value"
          n="primary" flex-1
        />
        <NButton title="Add" n="primary" @click="updateCookie(newCookie.key, newCookie.value)">
          <NIcon icon="i-carbon-save" />
        </NButton>
      </div>
    </div>
    <DefineDefaultInputs>
      <ServerRouteInputs v-model="currentParams" :default="{ type: 'string' }" max-h-xs of-auto>
        <template v-if="inputDefaults[activeTab]?.length">
          <div flex="~ gap2" mb--2 items-center op50>
            <div w-5 x-divider />
            <div flex-none>
              Default Inputs
            </div>
            <NIconButton
              icon="i-carbon-edit"
              @click="emit('open-default-input')"
            />
            <div x-divider />
          </div>
          <ServerRouteInputs v-model="inputDefaults[activeTab]" disabled p0 />
        </template>
      </ServerRouteInputs>
    </DefineDefaultInputs>
    <div v-if="activeTab === 'snippet'">
      <CodeSnippets
        v-if="codeSnippets.length"
        :code-snippets="codeSnippets"
      />
    </div>
    <div v-else-if="currentParams" border="b base" relative n-code-block>
      <template v-if="activeTab === 'body'">
        <div flex="~ wrap" w-full>
          <template v-for="item of tabInputs" :key="item">
            <button
              px4 py2 border="r base"
              hover="bg-active"
              :class="{ 'border-b': item !== selectedTabInput }"
              @click="selectedTabInput = item"
            >
              <div :class="{ op30: item !== selectedTabInput } " font-mono>
                {{ item }}
              </div>
            </button>
          </template>
          <div border="b base" flex-auto />
        </div>

        <UseDefaultInputs v-if="selectedTabInput === 'input'" />
        <JsonEditorVue
          v-else-if="selectedTabInput === 'json'"
          v-model="routeInputBodyJSON"
          :class="[$colorMode.value === 'dark' ? 'jse-theme-dark' : 'light']"
          class="json-editor-vue of-auto text-sm outline-none"
          v-bind="$attrs" mode="text" :navigation-bar="false" :indentation="2" :tab-size="2"
        />
      </template>
      <UseDefaultInputs v-else />
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
          {{ response.fetchTime }} ms
        </Badge>
      </div>
      <div v-if="responseLang === 'pdf'" flex-auto overflow-auto>
        <div border="~ base" h-full w-full rounded>
          <object :data="responseContent" type="application/pdf" flex-auto width="100%" height="100%" rounded />
        </div>
      </div>
      <!-- Rich response data -->
      <NCodeBlock
        v-else-if="responseLang !== 'media'"
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
