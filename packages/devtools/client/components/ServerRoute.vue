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

const params = props.route.params
const routeParams = ref<RouteParam>({})
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

const routeBody = ref()
const routeQuery = ref()

const fetchData = async () => {
  const start = Date.now()
  return await useLazyAsyncData(finalURL.value, () => $fetch(finalURL.value, {
    method: props.route.method as any,
    body: JSON.stringify(routeBody.value),
    query: routeQuery.value,
  }))
    .then((res: any) => {
      response.value = res
      fetchTime.value = Date.now() - start
    })
}
</script>

<template>
  <!-- TODO: make a better ui with more opttions -->
  <div grid="~ lg:cols-2 gap5" h-full of-hidden>
    <div grid="~ rows-[min-content_min-content_1fr]" h-full of-hidden relative>
      <div v-if="params.length" flex justify-between my-4>
        <NTextInput v-for="param in params" :key="param" v-model="routeParams[param]" :placeholder="`${param}...`" />
      </div>
      <!-- TODO: add body, query and ... -->
      <div>
        <NButton w-full icon="carbon:send" @click="fetchData">
          Fetch {{ finalURL }}
        </NButton>
      </div>
    </div>
    <div v-if="response" relative>
      <small absolute right-4 top-2>{{ fetchTime }}ms</small>
      <NCodeBlock py-2 :code="JSON.stringify(response, null, 2)" lang="json" />
      <small absolute right-4 bottom-2>{{ route.method.toUpperCase() }}</small>
    </div>
  </div>
</template>
