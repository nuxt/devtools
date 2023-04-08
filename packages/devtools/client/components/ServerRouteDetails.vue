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

const response = ref()
const fetchTime = ref(0)
const fetching = ref(false)

const params = props.route.params
const routeParams = ref<RouteParam>({})
const routeBodies = ref<RouteParam[]>([{ key: '', value: '' }])
const routeQueries = ref<RouteParam[]>([{ key: '', value: '' }])
const routeHeaders = ref<RouteParam[]>([{ key: 'Content-Type', value: 'application/json' }])

const finalURL = computed(() => {
  let result = props.route.url

  params.forEach((param) => {
    const currentParam = routeParams.value[param]
    result = result.replace(`[${param}]`, currentParam || param)
  })

  if (result.includes('routes/'))
    result = result.replace('routes/', '')

  return result
})

async function fetchData() {
  fetching.value = true
  const start = Date.now()
  return await useLazyAsyncData(`${props.route.method}:${finalURL.value}`, () => $fetch(finalURL.value, {
    method: props.route.method.toUpperCase() as any,
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

const tabs = ['params', 'query', 'body', 'headers']
const activeTab = ref(tabs[0])

const tabPanelButton = computed(() => {
  switch (activeTab.value) {
    case 'params':
      return !params.length
    case 'query':
      return !routeQueries.value.length
    case 'body':
      return !routeBodies.value.length
    case 'headers':
      return !routeHeaders.value.length
    default:
      return true
  }
})
</script>

<template>
  <div absolute top-0 right-0 left-0 bottom-0>
    <div flex="~ col gap-2" border="b base" p4 navbar-glass flex-1 pb2>
      <div flex="~ gap2">
        <NButton>
          {{ route.method.toUpperCase() }}
        </NButton>
        <NTextInput
          disabled
          :placeholder="finalURL"
          flex-auto
          p="x5 y2"
          n="primary"
        />
        <NButton @click="fetchData">
          <NIcon icon="carbon:send" />
        </NButton>
      </div>
      <div op50>
        <div flex justify-between>
          <div />
          <div flex>
            <Badge text-green-400 bg-green-400:10>
              {{ fetchTime }} ms
            </Badge>
          </div>
        </div>
      </div>
    </div>

    <NLoading v-lazy-show="fetching" absolute top-0 bottom-0 z-10 backdrop-blur>
      Fetching...
    </NLoading>
    <NCodeBlock absolute left-0 right-0 bottom-0 top-22 overflow-auto py-2 bottom-10 :code="response ? JSON.stringify(response, null, 2) : ''" lang="json" />

    <div v-if="tabPanelButton" absolute bottom-0 right-0 z-20 max-h-10>
      <div bg-primary text-white>
        <NIconButton v-if="activeTab === 'query' && routeQueries.length === 0" icon="carbon:add" w-10 h-10 @click="routeQueries.push({ key: '', value: '' })" />
        <NIconButton v-else-if="activeTab === 'body' && routeBodies.length === 0" icon="carbon:add" w-10 h-10 @click="routeBodies.push({ key: '' })" />
        <NIconButton v-else-if="activeTab === 'headers' && routeHeaders.length === 0" icon="carbon:add" w-10 h-10 @click="routeHeaders.push({ key: '' })" />
        <NIconButton v-else icon="carbon:parameter" w-10 h-10 />
      </div>
    </div>
    <div class="max-h-1/2" absolute bottom-0 left-0 right-0 overflow-auto z-10 px-4 min-h-10 bg-base border="t base">
      <div :class="{ 'mr-10': tabPanelButton }">
        <div flex justify-between w-full items-center text-center mt-2>
          <button v-for="tab in tabs" :key="tab" :class="{ 'text-primary': activeTab === tab }" @click="activeTab = tab">
            {{ tab }}
          </button>
        </div>
        <div my-2>
          <div v-if="params.length && activeTab === 'params'" flex justify-around my-4>
            <NTextInput v-for="param in params" :key="param" v-model="routeParams[param]" :placeholder="param" />
          </div>
          <div v-if="activeTab === 'query'">
            <div v-for="(query, index) in routeQueries" :key="index" flex justify-around my-4>
              <NButton @click="routeQueries.splice(index, 1)">
                <NIcon icon="carbon:subtract" />
              </NButton>
              <NTextInput v-model="query.key" placeholder="key" />
              <NTextInput v-model="query.value" placeholder="value" />
              <NButton @click="routeQueries.push({ key: '', value: '' })">
                <NIcon icon="carbon:add" />
              </NButton>
            </div>
          </div>
          <div v-if="activeTab === 'body'">
            <div v-for="(body, index) in routeBodies" :key="index" flex justify-around my-4>
              <NButton @click="routeBodies.splice(index, 1)">
                <NIcon icon="carbon:subtract" />
              </NButton>
              <NTextInput v-model="body.key" placeholder="key" />
              <NTextInput v-model="body.value" placeholder="value" />
              <NButton @click="routeBodies.push({ key: '', value: '' })">
                <NIcon icon="carbon:add" />
              </NButton>
            </div>
          </div>
          <div v-if="activeTab === 'headers'">
            <div v-for="(body, index) in routeHeaders" :key="index" flex justify-around my-4>
              <NButton @click="routeHeaders.splice(index, 1)">
                <NIcon icon="carbon:subtract" />
              </NButton>
              <NTextInput v-model="body.key" placeholder="key" />
              <NTextInput v-model="body.value" placeholder="value" />
              <NButton @click="routeHeaders.push({ key: '', value: '' })">
                <NIcon icon="carbon:add" />
              </NButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
