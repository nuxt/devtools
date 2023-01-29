<script setup lang="ts">
definePageMeta({
  layout: 'none',
})
// const data = useComponentInspectorData()
</script>

<template>
  <div px5 flex="~" items-center justify-center bg-base h-screen>
    <div absolute right-0 top-0 p2>
      <button carbon-close text-xl op50 hover:op100 ma />
    </div>
    <div>
      Inspecting Vue components
    </div>
  </div>
</template>
