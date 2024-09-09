<script setup lang="ts">
import { createReusableTemplate } from '@vueuse/core'
import JsonEditorVue from 'json-editor-vue'
import type { ServerRouteInput, ServerTaskInfo } from '~/../src/types'
import type { $Fetch } from 'ofetch'

const props = defineProps<{
  task: ServerTaskInfo
}>()

const emit = defineEmits<{
  (event: 'open-default-input'): void
}>()

const routeInputBodyJSON = ref<any>({ payload: {} })
const { inputDefaults } = useDevToolsOptions('serverRoutes')
const [DefineDefaultInputs, UseDefaultInputs] = createReusableTemplate()

const colorMode = getColorMode()
const config = useServerConfig()

const response = reactive({
  contentType: 'text/plain',
  data: '' as any,
  statusCode: 200,
  error: undefined as Error | undefined,
  fetchTime: 0,
})

const responseContent = computed(() => {
  return JSON.stringify(response.data, null, 2)
})

const responseLang = computed(() => {
  if (response.contentType.includes('application/json'))
    return 'json'
  return 'text'
})

const fetching = ref(false)
const started = ref(false)

const openInEditor = useOpenInEditor()

const activeTab = ref()

const tabInputs = ['json']
const selectedTabInput = ref(tabInputs[0])

const routeInputs = reactive({
  query: [{ active: true, key: '', value: '', type: 'string' }] as ServerRouteInput[],
  body: [{ active: true, key: '', value: '', type: 'string' }] as ServerRouteInput[],
  headers: [] as ServerRouteInput[],
})

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
  }
})
const parsedBody = computed(() => {
  return Object.keys(routeInputBodyJSON.value?.payload ?? {}).length
    ? {
        ...routeInputBodyJSON.value,
      }
    : undefined
})

const method = computed(() => {
  return parsedBody.value ? 'POST' : 'GET'
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
  const path = `/_nitro/tasks/${props.task.name}${query}`

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

  telemetry('server-tasks:run', {
    method: method.value,
  })

  try {
    response.data = await ($fetch as $Fetch)(finalURL.value, {
      method: 'POST', // routeMethod.value.toUpperCase() as any,
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

const tabs = computed(() => {
  const items = []
  items.push({
    name: 'Query',
    slug: 'query',
    length: routeInputs.query.length,
  })
  items.push({
    name: 'Body',
    slug: 'body',
    length: routeInputs.body.length,
  })
  return items
})

watchEffect(() => {
  if (selectedTabInput.value === 'json') {
    if (typeof routeInputBodyJSON.value === 'string') {
      try {
        routeInputBodyJSON.value = JSON.parse(routeInputBodyJSON.value)
      }
      catch {}
    }
  }
})

const savedRouteInputs = useLocalStorage<{ task: string, tab: string, inputs: any }[]>('nuxt-devtools:server-tasks:inputs', () => [], {
  window: window.parent,
})

watchDebounced([routeInputs, activeTab], () => {
  const savedEntry = savedRouteInputs.value?.find(entry => entry.task === props.task.name)

  if (!savedEntry) {
    const newEntry = {
      task: props.task.name,
      tab: 'query',
      inputs: routeInputs,
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
    const { body, query, headers } = savedEntry.inputs
    Object.assign(routeInputs, { body, query, headers })
  }
}, { immediate: true, deep: true, debounce: 500 })

const copy = useCopy()
</script>

<template>
  <div h-full w-full flex="~ col">
    <div flex="~ col gap-2" flex-none p4 n-navbar-glass>
      <div flex="~ gap2 items-center">
        <div v-tooltip="`Method is ${method} as ${method === 'GET' ? 'no' : ''} json body is sent`">
          <NButton
            class="n-badge-base n-sm"
            :class="getRequestMethodClass(method)" pointer-events-none font-mono
            tabindex="-1"
          >
            {{ method }}
          </NButton>
        </div>
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
              @click="copy(finalURL, 'server-task-url')"
            />
            <NButton
              v-tooltip="'Open in Editor'"
              title="Open in Editor"
              icon="carbon-launch"
              n="xs blue"
              :border="false"
              @click="openInEditor(task.handler)"
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
    <div v-if="currentParams" border="b base" relative n-code-block>
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
        Run task
      </NButton>
    </NPanelGrids>
    <NLoading v-else-if="fetching" z-10 flex-auto backdrop-blur>
      Running...
    </NLoading>
    <template v-else>
      <div border="b base" flex="~ gap2" items-center px4 py2>
        <div>Result</div>
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
        <div flex-auto />
        <div op50>
          Tasks finished in
        </div>
        <NBadge n="green">
          {{ response.fetchTime }} ms
        </NBadge>
      </div>
      <NCodeBlock
        flex-auto overflow-auto py-2
        :code="responseContent"
        :lang="responseLang"
      />
    </template>
  </div>
</template>
