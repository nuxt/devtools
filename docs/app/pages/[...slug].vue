<script setup lang="ts">
definePageMeta({
  layout: 'docs',
})
const route = useRoute()

const { data: page } = await useAsyncData(`docs-${route.path}`, () => queryCollection('docs').path(route.path).first())
if (!page.value)
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })

const { data: surround } = await useAsyncData(`docs-${route.path}-surround`, () => {
  return queryCollectionItemSurroundings('docs', route.path, {
    fields: ['title', 'description'],
  })
})

useSeoMeta({
  titleTemplate: '%s - Nuxt DevTools',
  title: page.value.title,
  ogTitle: `${page.value.title} - Nuxt DevTools`,
  description: page.value.description,
  ogDescription: page.value.description,
})

defineOgImage('OgImageDocs', {
  title: page.value.title,
  description: page.value.description,
})

const communityLinks = computed(() => [
  {
    icon: 'i-ph-pen-duotone',
    label: 'Edit this page',
    to: `https://github.com/nuxt/devtools/edit/main/docs/content/${page?.value?.stem}.md`,
    target: '_blank',
  },
  {
    icon: 'i-ph-shooting-star-duotone',
    label: 'Star on GitHub',
    to: 'https://github.com/nuxt/devtools',
    target: '_blank',
  },
  {
    icon: 'i-ph-chat-centered-text-duotone',
    label: 'Chat on Discord',
    to: 'https://chat.nuxt.dev',
    target: '_blank',
  },
  {
    icon: 'i-ph-hand-heart-duotone',
    label: 'Become a Sponsor',
    to: 'https://github.com/sponsors/nuxt',
    target: '_blank',
  },
  {
    icon: 'i-simple-icons-nuxtdotjs',
    label: 'Nuxt docs',
    to: 'https://nuxt.com',
    target: '_blank',
  },
])
</script>

<template>
  <UPage>
    <UPageHeader :title="page.title" :description="page.description" />

    <UPageBody prose class="pb-0">
      <ContentRenderer v-if="page.body" :value="page" />
      <hr v-if="surround?.length" class="my-8">
      <UContentSurround :surround="surround" />
    </UPageBody>

    <template v-if="page.body?.toc?.links?.length" #right>
      <UContentToc :links="page.body.toc.links">
        <template #bottom>
          <div class="hidden !mt-6 lg:block space-y-6">
            <USeparator v-if="page.body?.toc?.links?.length" />
            <UPageLinks title="Community" :links="communityLinks" />
          </div>
        </template>
      </UContentToc>
    </template>
  </UPage>
</template>
