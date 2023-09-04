<script setup>
definePageMeta({
  colorMode: 'dark',
})
const title = 'Nuxt Image: Optimized Images for your Nuxt Apps'
const description = 'Plug-and-play image optimization for Nuxt apps. Resize and transform your images using built-in optimizer or your favorite images CDN.'
useSeoMeta({
  titleTemplate: '',
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogImage: 'https://image.nuxt.com/social-card.png',
  twitterImage: 'https://image.nuxt.com/social-card.png',
})
const source = ref('npm i @nuxt/image@rc')
const { copy, copied } = useClipboard({ source })

const providers = ['cloudflare', 'cloudimage', 'cloudinary', 'directus', 'edgio', 'fastly', 'glide', 'gumlet', 'imageengine', 'imagekit', 'imgix', 'ipx', 'netlify', 'prepr', 'prismic', 'sanity', 'storyblok', 'strapi', 'twicpics', 'unsplash', 'uploadcare', 'vercel']
// Disabling because svg to png does not work now with SSG
// Related issue: https://github.com/unjs/ipx/issues/160
// const img = useImage()
</script>

<template>
  <ULandingHero
    align="center" direction="vertical"
    :ui="{ container: 'flex lg:gap-12', description: 'mt-6 text-lg/8 lg:px-28 text-gray-400' }"
  >
    <span class="gradient" />
    <template #title>
      Unleash Nuxt <br><span class="text-primary-400">Developer Experience</span>
    </template>
    <template #description>
      Nuxt DevTools: Elevate your Nuxt App insight and Developer Experience. Enhance transparency, identify performance
      gaps, and seamlessly manage app configurations.
    </template>
    <template #links>
      <UButton to="/get-started/installation" icon="i-ph-rocket-launch-duotone" size="xl">
        Get started
      </UButton>
      <UInput
        aria-label="Copy code to get started" :model-value="source" name="get-started" disabled autocomplete="off"
        size="xl" :ui="{ base: 'disabled:cursor-default', icon: { trailing: { pointer: '' } } }"
      >
        <template #leading>
          <UIcon name="i-ph-terminal" />
        </template>
        <template #trailing>
          <UButton
            aria-label="Copy Code" :color="copied ? 'green' : 'gray'" variant="ghost" :padded="false"
            :icon="copied ? 'i-ph-check-square-duotone' : 'i-ph-copy-duotone'" @click="copy(source)"
          />
        </template>
      </UInput>
    </template>
  </ULandingHero>
  <UContainer class="flex flex-col items-center justify-center">
    <VideoPlayer :source="{ type: 'mp4', src: '/videos/nuxt.mp4' }" poster="/videos/poster-volta.webp" />
    <span class="pt-4">Discover Nuxt DevTools in 3 minutes ✨</span>
  </UContainer>

  <ULandingSection>
    <template #title>
      Get the most of your images with<br><span class="text-primary-400">dynamic features</span>
    </template>
    <UPageGrid>
      <!-- <UPageCard to="/usage/nuxt-img" icon="i-ph-image-duotone">
        <template #title>
          Drop-in Replacement
        </template>
        Leverage <code>&lt;nuxt-img&gt;</code> and <code>&lt;nuxt-picture&gt;</code> drop-in replacement for the native
        <code>&lt;img&gt;</code> and <code>&lt;picture&gt;</code> elements.
      </UPageCard>
      <UPageCard to="/providers/ipx" title="Built-in resizer" icon="i-ph-crop">
        Unlock the power of our built-in image resizer and transformer with IPX.
      </UPageCard>
      <UPageCard to="/get-started/providers" title="20+ Providers Supported" icon="i-ph-plug-duotone">
        Choose over 20 image providers to optimize your images, no vendor lock-in.
      </UPageCard>
      <UPageCard to="/usage/nuxt-img#sizes" title="Responsive Ready" icon="i-ph-frame-corners">
        Nuxt Image dynamically generates responsive sizes. Your visuals adapt effortlessly to every screen size, offering
        a seamless user experience.
      </UPageCard>
      <UPageCard to="/usage/nuxt-img#format" title="Future-Proof Formats" icon="i-ph-magic-wand-duotone">
        Embrace the future of visual optimization with support for modern formats like webp and avif.
      </UPageCard>
      <UPageCard to="/get-started/installation" title="Streamlined Performance" icon="i-ph-rocket-launch-duotone">
        Deliver visually stunning content with lightning-fast load times, keeping your audience engaged and delighted.
      </UPageCard> -->
    </UPageGrid>
  </ULandingSection>
  <ULandingSection align="left">
    <template #title>
      Choose your<br><span class="text-primary-400">favorite provider</span>
    </template>
    <template #description>
      Nuxt Image supports multiple providers for high performance.<br>
      Providers are integrations between Nuxt Image and third-party image transformation services. Each provider is
      responsible for generating correct URLs for that image transformation service. Nuxt Image can also be configured to
      work with any external image transformation service.
    </template>
    <template #links>
      <UButton to="/get-started/installation" icon="i-ph-rocket-launch-duotone" size="xl">
        Get Started
      </UButton>
    </template>
    <div class="grid grid-cols-5 gap-4 lg:grid-cols-6 md:grid-cols-8 sm:grid-cols-6 lg:gap-6 sm:gap-5">
      <NuxtLink
        v-for="(provider, index) in providers" :key="index" :to="`/providers/${provider}`"
        class="block transition lg:hover:scale-110"
      >
        <!-- <NuxtImg :placeholder="img(`/providers/${provider}.svg`, { h: 10, f: 'png', blur: 2, q: 50 })" :src="`/providers/${provider}.svg`" :alt="provider" width="64" height="64" class="w-12 h-12 sm:w-16 sm:h-16 rounded-xl" loading="lazy" /> -->
        <NuxtImg
          :src="`/providers/${provider}.svg`" :alt="provider" width="64" height="64"
          class="h-12 w-12 rounded-xl sm:h-16 sm:w-16" loading="lazy"
        />
      </NuxtLink>
    </div>
  </ULandingSection>
</template>

<style scoped>
.gradient {
  position: absolute;
  top: -5vh;
  width: 100%;
  height: 30vh;
  background: radial-gradient(50% 50% at 50% 50%, #00DC82 0%, rgba(0, 220, 130, 0) 100%);
  filter: blur(150px);
  opacity: 0.6;
  z-index: -1;
}
</style>
