<script setup lang="ts">
const counter = useState(() => 0)

await callOnce(async () => {
  counter.value++
})

const { data } = await useAsyncData(() => Promise.resolve('async data'))
</script>

<template>
  <div>
    <div data-testid="counter">
      counter: {{ counter }}
    </div>
    <div data-testid="data">
      {{ data }}
    </div>
  </div>
</template>
