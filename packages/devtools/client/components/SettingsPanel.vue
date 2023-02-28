<script setup lang="ts">
const {
  interactionCloseOnOutsideClick,
  showExperimentalFeatures,
} = useDevToolsSettings()
</script>

<template>
  <div px4 py2 flex="~ col">
    <NCheckbox v-model="interactionCloseOnOutsideClick" n-primary>
      <span>Close DevTools when clicking outside</span>
    </NCheckbox>
    <NCheckbox v-model="showExperimentalFeatures" n-primary>
      <span>Show experimental features</span>
    </NCheckbox>
  </div>
</template>
