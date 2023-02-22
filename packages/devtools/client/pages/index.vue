<script setup lang="ts">
definePageMeta({
  layout: 'none',
})

function visit() {
  isFirstVisit.value = false
}
</script>

<template>
  <div flex="~ col gap4" h-screen items-center justify-center text-center w-160 mxa>
    <div flex="~" justify-center items-center>
      <NuxtLogo h-16 />
      <Badge
        bg-green-400:10 text-green-400 mr--15 mt--5
        title="preview"
        v-text="'preview'"
      />
    </div>
    <p text-xl font-bold my2>
      👋 Welcome trying the preview of Nuxt DevTools!
    </p>
    <p text-lg>
      <b font-bold>Nuxt DevTools</b> is a set of visual tools that help you to know your app/site better, and enhance your development experience with Nuxt.
    </p>
    <p text-lg>
      Be aware that <span px2 rounded font-bold bg-orange:10 py0.5 text-orange>Nuxt DevTools is still in early preview</span>, features might be incomplete and unstable. <a href="https://github.com/nuxt/devtools" target="_blank" text-primary hover-underline>Create an issue or discussion</a> if you find any bugs or have any suggestions. Thank you and have fun!
    </p>

    <NButton to="/modules/overview" mt-4 n="xl primary" @click="visit">
      <span>Get Started</span>
    </NButton>
  </div>
</template>
