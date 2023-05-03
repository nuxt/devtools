<script setup lang="ts">
const route = useRoute()

useHead({
  title: 'Bar page',
  htmlAttrs: {
    lang: 'en',
  },
  meta: [
    { name: 'description', content: 'Discover our list of modules to supercharge your Nuxt project. Created by the Nuxt team and community.' },
    { name: 'keywords', content: 'modules, nuxt, nuxt-devtools' },
    { name: 'theme-color', content: '#06b66e' },
    { name: 'author', content: 'Nuxt' },
    { name: 'copyright', content: 'Nuxt' },
    { name: 'robots', content: 'no-index' },

    // OG
    { name: 'og:url', content: route.fullPath },
    { name: 'og:type', content: 'website' },
    { name: 'og:locale', content: 'en' },
    { name: 'og:site_name', content: 'Nuxt' },
    { name: 'og:title', content: 'Bar page' },
    { name: 'og:description', content: 'Discover our list of modules to supercharge your Nuxt project. Created by the Nuxt team and community.' },
    { name: 'og:image', content: 'https://nuxt.com/socials/modules.jpg' },
    { name: 'og:image:alt', content: 'Bar page' },

    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Bar page' },
    { name: 'twitter:image:alt', content: 'Bar page' },
    { name: 'twitter:description', content: 'Discover our list of modules to supercharge your Nuxt project. Created by the Nuxt team and community.' },
    { name: 'twitter:image', content: 'https://nuxt.com/socials/modules.jpg' },
    { name: 'twitter:image:alt', content: 'Bar page' },
    { name: 'twitter:site', content: 'nuxt_js' },
    { name: 'twitter:creator', content: 'nuxt_js' },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
    },
  ],
})
</script>

<template>
  <div>
    Bar, is full!
  </div>
</template>
