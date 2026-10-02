<script setup lang="ts">
// keyed factory composable + plain composables, all at setup time
const { data: api, refresh, status } = await useApiData<{ msg: string }>('/api/data')
const { data: async1 } = await useAsyncData('slow-async', async () => {
  await slowTask(600)
  return 'async data'
})
const { data: get } = await useFetch<{ msg: string }>('/api/data', { method: 'POST', body: { name: 'useFetch' }, key: 'plain-fetch' })

const manual = ref('')
async function callApi() {
  const res = await $fetch<{ msg: string }>('/api/data', { method: 'POST', body: { name: 'manual $fetch' } })
  manual.value = res.msg
}
</script>

<template>
  <div>
    <h2>Fetch</h2>
    <div data-testid="api">
      useApiData: {{ api?.msg }} ({{ status }})
    </div>
    <div data-testid="async">
      useAsyncData: {{ async1 }}
    </div>
    <div data-testid="fetch">
      useFetch: {{ get?.msg }}
    </div>
    <div data-testid="manual">
      $fetch: {{ manual }}
    </div>
    <button @click="refresh()">
      refresh useApiData
    </button>
    <button @click="callApi">
      call $fetch
    </button>
  </div>
</template>
