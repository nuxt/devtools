<script setup>
useServerSeoMeta({
  ogSiteName: 'Nuxt DevTools',
  twitterCard: 'summary_large_image',
})
useHead({
  htmlAttrs: {
    lang: 'en',
  },
})
const links = [{
  label: 'Documentation',
  to: '/guide/getting-started',
}, {
  label: 'Playground',
  to: '/playground',
}, {
  label: 'Releases',
  to: 'https://github.com/nuxt/devtools/releases',
  target: '_blank',
}]
const { version } = useRuntimeConfig().public
const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('docs'))

// Provide
provide('navigation', navigation)
</script>

<template>
  <UApp>
    <UHeader title="Nuxt DevTools">
      <template #left>
        <NuxtLink to="/" aria-label="Nuxt DevTools">
          <Logo />
        </NuxtLink>
        <UBadge variant="subtle" color="neutral" size="sm">
          v{{ version }}
        </UBadge>
      </template>

      <UNavigationMenu :items="links" />

      <template #right>
        <UColorModeButton />
        <UButton
          aria-label="Nuxt Website" icon="i-simple-icons-nuxtdotjs" to="https://nuxt.com"
          target="_blank" color="neutral" variant="ghost"
        />
        <UButton
          aria-label="Nuxt on Bluesky" icon="i-simple-icons-bluesky" to="https://go.nuxt.com/bluesky"
          target="_blank" color="neutral" variant="ghost"
        />
        <UButton
          aria-label="Nuxt on X" icon="i-simple-icons-x" to="https://x.com/nuxt_js"
          target="_blank" color="neutral" variant="ghost"
        />
        <UButton
          aria-label="Nuxt DevTools on GitHub" icon="i-simple-icons-github"
          to="https://github.com/nuxt/devtools"
          target="_blank" color="neutral" variant="ghost"
        />
      </template>
      <!-- Mobile panel -->
      <template v-if="$route.path !== '/'" #body>
        <UContentSearchButton :collapsed="false" class="mb-4 w-full" />
        <UContentNavigation :navigation="navigation" default-open />
      </template>
    </UHeader>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UFooter>
      <template #left>
        <span class="text-sm">
          Published under <NuxtLink to="https://github.com/nuxt/devtools" target="_blank" class="underline">MIT License</NuxtLink>
        </span>
      </template>
      <template #right>
        <UColorModeButton />
        <UButton
          aria-label="Nuxt Website" icon="i-simple-icons-nuxtdotjs"
          to="https://nuxt.com"
          target="_blank" color="neutral" variant="ghost"
        />
        <UButton
          aria-label="Nuxt on Bluesky" icon="i-simple-icons-bluesky"
          to="https://go.nuxt.com/bluesky"
          target="_blank" color="neutral" variant="ghost"
        />
        <UButton
          aria-label="Nuxt on X" icon="i-simple-icons-x"
          to="https://x.com/nuxt_js"
          target="_blank" color="neutral" variant="ghost"
        />
        <UButton
          aria-label="Nuxt DevTools on GitHub" icon="i-simple-icons-github"
          to="https://github.com/nuxt/devtools"
          target="_blank" color="neutral" variant="ghost"
        />
      </template>
    </UFooter>
    <UContentSearch :navigation="navigation" :links="links" />
  </UApp>
</template>
