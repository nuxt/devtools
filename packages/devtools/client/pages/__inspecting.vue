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
  <NPanelGrids h-screen w-screen px5>
    <div absolute right-0 top-0 p2>
      <button carbon-close ma text-xl op50 hover:op100 @click="close" />
    </div>
    <div>
      Inspecting Vue components
    </div>
  </NPanelGrids>
</template>
