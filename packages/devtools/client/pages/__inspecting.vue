<script setup lang="ts">
definePageMeta({
  layout: 'none',
})
// const data = useComponentInspectorData()
const client = useClient()
</script>

<template>
  <div flex="~" items-center justify-center bg-base h-screen px5>
    <div absolute right-0 top-0 p2>
      <button text-xl op50 hover:op100 ma carbon-close @click="client?.inspector?.instance?.disable" />
    </div>
    <div>
      Inspecting Vue components
    </div>
  </div>
</template>
