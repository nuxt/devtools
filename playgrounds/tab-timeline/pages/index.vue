<script setup lang="ts">
useHead({
  title: 'Home page',
  meta: [
    {
      property: 'og:title',
      content: 'Home page',
    },
    {
      property: 'og:description',
      content: 'This is the home page',
    },
    {
      property: 'og:image',
      content: 'https://nuxt.com/assets/blog/nuxt-devtools-0-3.png',
    },
  ],
})

onMounted(() => {
  doSomething()

  setTimeout(() => {
    doSomething()
  }, 2000)
})
</script>

<template>
  <div>
    Home
  </div>
</template>
