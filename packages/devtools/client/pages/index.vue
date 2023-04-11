<script setup lang="ts">
definePageMeta({
  layout: 'none',
})

function visit() {
  isFirstVisit.value = false
}
</script>

<template>
  <div flex="~ col gap4" mxa h-screen w-160 items-center justify-center text-center>
    <div flex="~" items-center justify-center>
      <NuxtLogo h-16 />
      <Badge
        mr--15 mt--5 bg-green-400:10 text-green-400
        title="preview"
        v-text="'preview'"
      />
    </div>
    <p my2 text-xl font-bold>
      👋 Welcome trying the preview of Nuxt DevTools!
    </p>
    <p text-lg>
      <b font-bold>Nuxt DevTools</b> is a set of visual tools that help you to know your app/site better, and enhance your development experience with Nuxt.
    </p>
    <p text-lg>
      Be aware that <span rounded bg-orange:10 px2 py0.5 font-bold text-orange>Nuxt DevTools is still in early preview</span>, features might be incomplete and unstable. <a href="https://github.com/nuxt/devtools" target="_blank" text-primary hover-underline>Create an issue or discussion</a> if you find any bugs or have any suggestions. Thank you and have fun!
    </p>

    <NButton to="/modules/overview" mt-4 n="xl primary" @click="visit">
      <span>Get Started</span>
    </NButton>
  </div>
</template>
