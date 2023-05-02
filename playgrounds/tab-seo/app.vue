<script setup lang="ts">
useHead({
  title: 'SEO example',
  link: [
    {
      rel: 'icon',
      href: 'https://nuxt.com/icon.png',
    },
  ],
  meta: [
    {
      property: 'og:title',
      content: 'SEO example',
    },
    {
      property: 'og:description',
      content: 'This is an SEO example',
    },
    {
      property: 'og:image',
      content: 'https://nuxt.com/assets/blog/nuxt-static-improvements.png',
    },
    {
      property: 'twitter:card',
      content: 'summary_large_image',
    },
  ],
})
</script>

<template>
  <GlobalNav />
  <NuxtPage />
</template>
