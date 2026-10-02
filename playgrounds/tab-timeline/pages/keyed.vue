<script setup lang="ts">
const counter = useState(() => 0)

await callOnce(async () => {
  counter.value++
})

const { data } = await useAsyncData(() => Promise.resolve('async data'))

const { data: api } = await useApiData<{ msg: string }>('/api/data')
</script>

<template>
  <div>
    <div data-testid="counter">
      counter: {{ counter }}
    </div>
    <div data-testid="data">
      {{ data }}
    </div>
    <div data-testid="api">
      {{ api?.msg }}
    </div>
  </div>
</template>
