<script setup lang="ts">
import { telemetryEnabled } from '~/composables/telemetry'

definePageMeta({
  layout: 'none',
})

const telemetry = ref(true)
const enableFloatPanel = ref(true)

const {
  showPanel,
} = useDevToolsUIOptions()

function visit() {
  telemetryEnabled.value = telemetry.value
  if (showPanel.value == null && enableFloatPanel.value)
    showPanel.value = true
  isFirstVisit.value = false
}
</script>

<template>
  <NPanelGrids flex="~ col" relative h-screen w-full>
    <div flex="~ auto col gap3" items-center justify-center text-center>
      <p my2 text-3em text-primary font-bold font-stylish>
        👋 Hi there, welcome to Nuxt DevTools!
      </p>
      <p max-w-190 text-lg>
        <NuxtLogo mr-0.5 inline-block h-5 translate-y--1.1 align-mid /> is a set of visual tools that help you to know your Nuxt app better, and enhance your
        development experience with Nuxt. Enjoy!<br>
      </p>
      <p mb6 op50>
        Learn more at
        <NLink href="https://devtools.nuxt.com/" target="_blank" rel="noopener noreferrer" n="primary">
          devtools.nuxt.com
        </NLink>
      </p>

      <NButton to="/modules/overview" n="lg primary" @click="visit">
        <span>Get Started</span>
      </NButton>
    </div>
    <div p4>
      <div flex="~ col gap-2" mxa>
        <NCheckbox v-if="showPanel == null" v-model="enableFloatPanel" n="green6">
          <span op50>Show floating panel from now on</span>
        </NCheckbox>
        <NCheckbox v-model="telemetry" n="green6">
          <span op50>Send anonymous statistics, help us improving DevTools</span>
          <NLink href="https://github.com/nuxt/devtools#anonymous-usage-analytics" target="_blank" ml1 op35 v-text="'Learn more'" />
        </NCheckbox>
      </div>
    </div>
  </NPanelGrids>
</template>
