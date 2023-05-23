<script setup lang="ts">
definePageMeta({
  layout: 'full',
})

const {
  interactionCloseOnOutsideClick,
  // showExperimentalFeatures,
  showHelpButtons,
  scale,
  hiddenTabs,
  hiddenTabCategories,
} = useDevToolsOptions()

const scaleOptions = [
  ['Tiny', 12 / 15],
  ['Small', 14 / 15],
  ['Normal', 1],
  ['Large', 16 / 15],
  ['Huge', 18 / 15],
]

const categories = getCategorizedTabs(useAllTabs())

function toggleTab(name: string, v: boolean) {
  if (v)
    hiddenTabs.value = hiddenTabs.value.filter(i => i !== name)
  else
    hiddenTabs.value.push(name)
}

function toggleTabCategory(name: string, v: boolean) {
  if (v)
    hiddenTabCategories.value = hiddenTabCategories.value.filter(i => i !== name)
  else
    hiddenTabCategories.value.push(name)
}
</script>

<template>
  <div px6 py6>
    <NIconTitle
      class="mb-5 text-xl op75"
      icon="i-carbon-settings-adjust"
      text="DevTools Settings"
    />
    <div grid="~ md:cols-2 gap-x-10 gap-y-3" max-w-300>
      <div flex="~ col gap-1" py3>
        <h3 mb1 text-lg>
          Tabs
        </h3>
        <template v-for="[name, tabs] of categories" :key="name">
          <div
            v-if="tabs.length"
            flex="~ col gap-1" mx--1
            :class="hiddenTabCategories.includes(name) ? 'op50 grayscale' : ''" pt-2
          >
            <NSwitch
              flex="~ row-reverse" px2 py1 n-lime
              :model-value="!hiddenTabCategories.includes(name)"
              @update:model-value="v => toggleTabCategory(name, v)"
            >
              <div flex="~ gap-2" flex-auto items-center justify-start>
                <span capitalize op75>{{ name }}</span>
              </div>
            </NSwitch>
            <div flex="~ col gap-1" border="~ base rounded" py3 pl4 pr2>
              <template v-for="tab of tabs" :key="tab.name">
                <NSwitch
                  flex="~ row-reverse" py1 pl2 pr1 n-primary
                  :model-value="!hiddenTabs.includes(tab.name)"
                  @update:model-value="v => toggleTab(tab.name, v)"
                >
                  <div flex="~ gap-2" flex-auto items-center justify-start :class="hiddenTabs.includes(tab.name) ? 'op25' : ''">
                    <TabIcon text-xl :icon="tab.icon" :title="tab.title" />
                    <span>{{ tab.title }}</span>
                  </div>
                </NSwitch>
              </template>
            </div>
          </div>
        </template>
      </div>
      <div>
        <div py3 flex="~ col gap-1" border="b base">
          <h3 mb1 text-lg>
            Appearance
          </h3>
          <div>
            <NDarkToggle v-slot="{ toggle, isDark }">
              <NButton n="primary" @click="toggle">
                <div carbon-sun dark:carbon-moon translate-y--1px /> {{ isDark.value ? 'Dark' : 'Light' }}
              </NButton>
            </NDarkToggle>
          </div>
        </div>
        <div py3 flex="~ col gap-1" border="b base">
          <h3 mb1 text-lg>
            UI Scale
          </h3>
          <NSelect v-model="scale" n="primary">
            <option v-for="i of scaleOptions" :key="i[0]" :value="i[1]">
              {{ i[0] }}
            </option>
          </NSelect>
        </div>
        <div py3 flex="~ col gap-1">
          <h3 mb1 text-lg>
            Features
          </h3>
          <NCheckbox v-model="interactionCloseOnOutsideClick" n-primary>
            <span>Close DevTools when clicking outside</span>
          </NCheckbox>
          <!-- <NCheckbox v-model="showExperimentalFeatures" n-primary>
            <span>Show experimental features</span>
          </NCheckbox> -->
          <NCheckbox v-model="showHelpButtons" n-primary>
            <span>Show help buttons</span>
          </NCheckbox>
        </div>
      </div>
    </div>
  </div>
</template>
