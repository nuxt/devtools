<script setup lang="ts">
import { telemetryEnabled } from '~/composables/telemetry'

definePageMeta({
  layout: 'none',
})

const telemetry = ref(true)

function visit() {
  telemetryEnabled.value = telemetry.value
  isFirstVisit.value = false
}
</script>

<template>
  <NPanelGrids flex="~ col gap3" relative h-screen w-full items-center justify-center text-center>
    <p my2 text-3em font-bold font-stylish text-primary>
      👋 Hi there, welcome to Nuxt DevTools!
    </p>
    <p max-w-190 text-lg>
      <NuxtLogo inline-block h-8 translate-y--0.8 align-mid /> is a set of visual tools that help you to know your Nuxt app better, and enhance your
      development experience with Nuxt. Enjoy!<br>
    </p>
    <p mb6 op50>
      Learn more at
      <NLink href="https://devtools.nuxtjs.org/" target="_blank" rel="noopener noreferrer" n="primary">
        devtools.nuxtjs.org
      </NLink>
    </p>


    <NButton to="/modules/overview" n="lg primary" @click="visit">
      <span>Get Started</span>
    </NButton>


    <div absolute bottom-0 left-0 right-0 p4>
      <NCheckbox v-model="telemetry">
        <span op50>Send anonymous statistics, help us improving DevTools</span>
      </NCheckbox>
    </div>
  </NPanelGrids>
</template>
