<script setup lang="ts">
import { definePageMeta } from '#imports'
import { ref } from 'vue'
import { useClient } from '~/composables/client'
import { isFirstVisit } from '~/composables/storage'
import { useDevToolsOptions } from '~/composables/storage-options'
import { telemetryEnabled } from '~/composables/telemetry'

definePageMeta({
  layout: 'none',
})

const client = useClient()
const telemetryModel = ref(true)

const {
  showPanel,
} = useDevToolsOptions('ui')

function visit() {
  telemetryEnabled.value = telemetryModel.value
  isFirstVisit.value = false
}

function hideFloatingPanel() {
  showPanel.value = false
  client.value.devtools.close()
}
</script>

<template>
  <NPanelGrids flex="~ col" relative h-screen w-full>
    <div flex="~ auto col gap3" items-center justify-center text-center>
      <h1 my2 text-3em text-primary font-bold font-stylish aria-label="Nuxt DevTools Welcome">
        👋 Hi there, welcome to Nuxt DevTools!
      </h1>
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

      <NButton to="/modules/overview" n="lg primary" aria-label="Get Started" @click="visit">
        <span>Get Started</span>
      </NButton>
      <NButton v-if="showPanel !== false" n="borderless orange" @click="hideFloatingPanel">
        <span>Always hide the floating panel</span>
      </NButton>
    </div>
    <div p4>
      <div flex="~ col gap-2" mxa>
        <NCheckbox v-model="telemetryModel" n="green6">
          <span op50>Send anonymous statistics, help us improving DevTools</span>
          <NLink href="https://github.com/nuxt/devtools#anonymous-usage-analytics" target="_blank" ml1 op35 v-text="'Learn more'" />
        </NCheckbox>
      </div>
    </div>
  </NPanelGrids>
</template>
