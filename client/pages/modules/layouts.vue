<script setup lang="ts">
definePageMeta({
  icon: 'carbon-chart-treemap',
  title: 'Layouts',
  wip: true,
})

const layouts = useLayouts()
</script>

<template>
  <div>
    <pre>{{ layouts }}</pre>
  </div>
</template>
