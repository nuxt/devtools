<script setup lang="ts">
import { createReusableTemplate, watchDebounced } from '@vueuse/core'
import JsonEditorVue from 'json-editor-vue'
import type { CodeSnippet, ServerRouteInfo, ServerRouteInput } from '~/../src/types'
import type { $Fetch } from 'ofetch'

const props = defineProps<{
  route: ServerRouteInfo
}>()

const emit = defineEmits<{
  (event: 'open-default-input'): void
}>()

const [DefineDefaultInputs, UseDefaultInputs] = createReusableTemplate()

const colorMode = getColorMode()
const config = useServerConfig()
const client = useClient()

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

const parsedRoute = computed(() => props.route.route?.split(/((?:\*\*)?:\w+)/g))
const paramNames = computed(() => parsedRoute.value?.filter(i => i.startsWith(':') || i.startsWith('**:')) || [])

const routeMethod = ref(props.route.method || 'GET')
const routeParams = ref<{ [key: string]: string }>({})
const routeInputs = reactive({
  query: [{ active: true, key: '', value: '', type: 'string' }] as ServerRouteInput[],
  body: [{ active: true, key: '', value: '', type: 'string' }] as ServerRouteInput[],
  headers: [{ active: true, key: 'Content-Type', value: 'application/json', type: 'string' }] as ServerRouteInput[],
})
const routeInputBodyJSON = ref<any>({})
const {
  inputDefaults,
  sendFrom,
} = useDevToolsOptions('serverRoutes')

const resolvedSendFrom = computed(() => {
  if (!client?.value?.app?.$fetch)
    return 'devtools'
  return sendFrom.value
})

const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD']
// https://github.com/unjs/h3/blob/main/src/utils/body.ts#L19
const bodyPayloadMethods = ['PATCH', 'POST', 'PUT', 'DELETE']
const hasBody = computed(() => bodyPayloadMethods.includes(routeMethod.value.toUpperCase()))

const activeTab = ref()

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
  let url = window?.location.origin
  if (url.charAt(url.length - 1) === '/')
    url = url.slice(0, -1)
  return url
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

function parseInputs(inputs: ServerRouteInput[]) {
  const formatted = Object.fromEntries(
    inputs.filter(({ active, key, value }) => active && key && value !== undefined).map(({ key, value }) => [key, value]),
  )
  return Object.entries(formatted).length ? formatted : undefined
}

async function fetchData() {
  started.value = true
  fetching.value = true

  const start = Date.now()

  const f = resolvedSendFrom.value === 'app'
    ? client.value!.app!.$fetch
    : $fetch as $Fetch

  telemetry('server-routes:fetch', {
    method: routeMethod.value,
    sendFrom: resolvedSendFrom.value,
  })

  try {
    response.data = await f(finalURL.value, {
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
  catch {}

  fetching.value = false
  response.fetchTime = Date.now() - start
}

const codeSnippets = computed(() => {
  const snippets: CodeSnippet[] = []

  const items: string[] = []
  const headers = Object.entries(parsedHeader.value)
    .filter(([key, value]) => key && value && !(key === 'Content-Type' && value === 'application/json'))
    .map(([key, value]) => `  '${key}': '${value}'`)
    .join(',\n')

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

const cookies = ref(getCookies())
const newCookie = reactive({ key: '', value: '' })

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
    length: cookies.value.length,
  })
  items.push({
    name: 'Snippets',
    slug: 'snippet',
  })
  return items
})

function getCookies() {
  return document.cookie.split('; ').map((i) => {
    const [key, value] = i.split('=')
    return { key, value }
  }).filter(i => i.key)
}

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

const savedRouteInputs = useLocalStorage<{ path: string, tab: string, inputs: any }[]>('nuxt-devtools:server-routes:inputs', () => [], {
  window: window.parent,
})

watchDebounced([routeInputs, activeTab], () => {
  const savedEntry = savedRouteInputs.value?.find((entry: any) => entry.path === props.route.filepath)

  if (!savedEntry) {
    const newEntry = {
      path: props.route.filepath,
      tab: paramNames.value.length ? 'params' : 'query',
      inputs: {
        ...routeInputs,
        ...(paramNames.value.length ? { params: routeParams.value } : {}),
      },
    }
    savedRouteInputs.value.push(newEntry)

    if (!activeTab.value)
      activeTab.value = newEntry.tab
  }
  else {
    if (!activeTab.value)
      activeTab.value = savedEntry.tab

    if (savedEntry.tab !== activeTab.value)
      savedEntry.tab = activeTab.value

    //  update routeInputs with local storage
    const { body, query, headers, params } = savedEntry.inputs
    Object.assign(routeInputs, { body, query, headers })
    routeParams.value = params
  }
}, { immediate: true, deep: true, debounce: 500 })

function clearSavedCache() {
  savedRouteInputs.value = []
  routeInputs.body = []
  routeInputs.query = []
  routeInputs.headers = []
  routeParams.value = {}
  activeTab.value = paramNames.value.length ? 'params' : 'query'
}

const copy = useCopy()
</script>

<template>
  <div h-full w-full flex="~ col">
    <div flex="~ col gap-2" flex-none p4 n-navbar-glass>
      <div flex="~ gap2 items-center">
        <NButton
          v-if="route.method"
          class="n-badge-base n-sm"
          :class="getRequestMethodClass(routeMethod)"
          pointer-events-none font-mono tabindex="-1"
        >
          {{ routeMethod.toUpperCase() }}
        </NButton>
        <NSelect
          v-else
          v-model="routeMethod"
          class="n-badge-base n-sm"
          :class="getRequestMethodClass(routeMethod)"
        >
          <option v-for="method of methods" :key="method" :class="getRequestMethodClass(method)">
            {{ method.toUpperCase() }}
          </option>
        </NSelect>
        <div relative w-full>
          <NTextInput
            :model-value="finalPath"
            readonly flex-auto font-mono
            p="x5 y2"
            n="sm"
          />
          <div absolute right-2 top-1.5 flex="~ gap-1">
            <NButton
              v-tooltip="'Copy URL'"
              title="Copy URL"
              n="xs blue"
              icon="carbon:copy"
              :border="false"
              @click="copy(finalURL, 'server-route-url')"
            />
            <NButton
              v-tooltip="'Open in Editor'"
              title="Open in Editor"
              icon="carbon-launch"
              n="xs blue"
              :border="false"
              @click="openInEditor(route.filepath)"
            />
          </div>
        </div>
        <NButton h-full n="primary solid" @click="fetchData">
          <NIcon icon="carbon:send" />
        </NButton>
      </div>
    </div>

    <div flex="~ gap2 wrap" w-full items-center px4 pb2 text-center text-sm border="b base">
      <NButton
        v-for="tab of tabs"
        :key="tab.slug"
        v-tooltip="tab.name"
        :class="activeTab === tab.slug ? 'text-primary n-primary' : 'border-transparent shadow-none'"
        @click="activeTab = tab.slug"
      >
        <NIcon :icon="ServerRouteTabIcons[tab.slug]" />
        <div class="hidden md:block">
          {{ tab.name }}
          {{ tab?.length ? `(${tab.length})` : '' }}
          <span>
            {{ inputDefaults[tab.slug]?.length ? `(${inputDefaults[tab.slug].length})` : '' }}
          </span>
        </div>
      </NButton>
      <div flex-auto />
      <div text-xs op50>
        Send from
      </div>
      <NSelect
        v-model="resolvedSendFrom"
        class="n-xs"
        :disabled="!client?.app?.$fetch"
      >
        <option value="app">
          App
        </option>
        <option value="devtools">
          DevTools
        </option>
      </NSelect>
      <NButton v-tooltip="'Clear Inputs Saved Cache'" n="orange" class="p-3" icon="i-carbon-clean" @click="clearSavedCache" />
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
          @input="updateCookie(cookie.key, ($event as any).target?.value)"
        />
        <NButton title="Delete" n="red" @click="updateCookie(cookie.key, undefined)">
          <NIcon icon="i-carbon-trash-can" />
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
      <ServerRouteInputs v-model="currentParams" :default="{ active: true, type: 'string' }" max-h-xs of-auto>
        <template v-if="inputDefaults[activeTab]?.length">
          <div flex="~ gap2" mb--2 items-center op50>
            <div w-5 x-divider />
            <div flex-none>
              Default Inputs
            </div>
            <NButton
              icon="i-carbon-edit"
              :border="false"
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
        <!-- TODO: Mode does not have correct type, remove when upstream fixes -->
        <JsonEditorVue
          v-else-if="selectedTabInput === 'json'"
          v-model="routeInputBodyJSON"
          :class="colorMode === 'dark' ? 'jse-theme-dark' : 'light'"
          class="json-editor-vue of-auto text-sm outline-none"
          v-bind="$attrs"
          :mode="('text' as any)"
          :navigation-bar="false"
          :indentation="2"
          :tab-size="2"
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
        <NBadge
          v-if="response.error"
          n="red"
        >
          Error
        </NBadge>
        <NBadge :n="response.error ? 'orange' : 'green'" v-text="response.statusCode" />
        <code v-if="response.contentType" text-xs op50>
          {{ response.contentType }}
        </code>
        <DataSchemaButton
          v-if="response.contentType === 'application/json'"
          :getter="() => ({ input: responseContent })"
        />
        <div flex-auto />
        <div op50>
          Request finished in
        </div>
        <NBadge n="green">
          {{ response.fetchTime }} ms
        </NBadge>
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
