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
  <div flex="~" h-screen items-center justify-center px5 bg-base>
    <div absolute right-0 top-0 p2>
      <button carbon-close ma text-xl op50 hover:op100 @click="close" />
    </div>
    <div>
      Inspecting Vue components
    </div>
  </div>
</template>
