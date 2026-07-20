<script setup lang="ts">
const counter = useState(() => 0)

await callOnce(async () => {
  counter.value++
})
</script>

<template>
  <div>counter: {{ counter }}</div>
</template>
