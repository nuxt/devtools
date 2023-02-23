<script setup lang="ts">
definePageMeta({
  layout: 'none',
})
// const data = useComponentInspectorData()
const client = useClient()

useEventListener('keydown', (e) => {
  if (e.key === 'Escape')
    close()
})

function close() {
  client.value?.inspector?.disable()
}
</script>

<template>
  <div flex="~" items-center justify-center bg-base h-screen px5>
    <div absolute right-0 top-0 p2>
      <button text-xl op50 hover:op100 ma carbon-close @click="close" />
    </div>
    <div>
      Inspecting Vue components
    </div>
  </div>
</template>
