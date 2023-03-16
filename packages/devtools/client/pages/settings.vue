<script setup lang="ts">
const {
  interactionCloseOnOutsideClick,
  showExperimentalFeatures,
  scale,
  hiddenTabs,
} = useDevToolsSettings()

const scaleOptions = [
  ['Tiny', 12 / 15],
  ['Small', 14 / 15],
  ['Normal', 1],
  ['Large', 16 / 15],
  ['Huge', 18 / 15],
]

const allTabs = useTabs()

function toggleTab(name: string, v: boolean) {
  if (v)
    hiddenTabs.value = hiddenTabs.value.filter(i => i !== name)
  else
    hiddenTabs.value.push(name)
}
</script>

<template>
  <div px6 max-w-100 py8>
    <NIconTitle
      class="text-xl op75"
      icon="i-carbon-settings"
      text="DevTools Settings"
    />

    <div py3 flex="~ col gap-1" border="b base">
      <h3 text-lg mb1>
        UI Scale
      </h3>
      <NSelect v-model="scale" n="primary">
        <option v-for="i of scaleOptions" :key="i[0]" :value="i[1]">
          {{ i[0] }}
        </option>
      </NSelect>
    </div>
    <div py3 flex="~ col gap-1" border="b base">
      <h3 text-lg mb1>
        Features
      </h3>
      <NCheckbox v-model="interactionCloseOnOutsideClick" n-primary>
        <span>Close DevTools when clicking outside</span>
      </NCheckbox>
      <NCheckbox v-model="showExperimentalFeatures" n-primary>
        <span>Show experimental features</span>
      </NCheckbox>
    </div>
    <div py3 flex="~ col gap-1">
      <h3 text-lg mb1>
        Tabs
      </h3>
      <template v-for="tab of allTabs.all.value" :key="tab.name">
        <NSwitch
          n-primary flex="~ row-reverse" py1
          :model-value="!hiddenTabs.includes(tab.name)"
          @update:model-value="v => toggleTab(tab.name, v)"
        >
          <div flex="~ gap-2" items-center flex-auto justify-start :class="hiddenTabs.includes(tab.name) ? 'op25' : ''">
            <TabIcon text-xl :icon="tab.icon" :title="tab.title" />
            <span>{{ tab.title }}</span>
          </div>
        </NSwitch>
      </template>
    </div>
  </div>
</template>
