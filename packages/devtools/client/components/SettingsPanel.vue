<script setup lang="ts">
const {
  interactionCloseOnOutsideClick,
  showExperimentalFeatures,
  scale,
} = useDevToolsSettings()

const scaleOptions = [
  ['Tiny', 12 / 15],
  ['Small', 14 / 15],
  ['Normal', 1],
  ['Large', 16 / 15],
  ['Huge', 18 / 15],
]
</script>

<template>
  <div px4 py2 flex="~ col" border="b base">
    <div>UI Scale</div>
    <NSelect v-model="scale" n="primary">
      <option v-for="i of scaleOptions" :key="i[0]" :value="i[1]">
        {{ i[0] }}
      </option>
    </NSelect>
  </div>
  <div px4 py2 flex="~ col">
    <NCheckbox v-model="interactionCloseOnOutsideClick" n-primary>
      <span>Close DevTools when clicking outside</span>
    </NCheckbox>
    <NCheckbox v-model="showExperimentalFeatures" n-primary>
      <span>Show experimental features</span>
    </NCheckbox>
  </div>
</template>
