<script setup>
definePageMeta({
  colorMode: 'dark',
})
const title = 'Nuxt DevTool: Unleash Nuxt Developer Experience'
const description = 'Nuxt DevTools: Elevate your Nuxt App insight and Developer Experience. Enhance transparency, identify performance gaps, and seamlessly manage app configurations.'
useSeoMeta({
  titleTemplate: '',
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogImage: 'https://image.nuxt.com/social-card.png',
  twitterImage: 'https://image.nuxt.com/social-card.png',
})

const advancedCards = [
  {
    title: 'Developer experience',
    description: 'Enhance your DX even further, and adding an extra layer of enjoyment to the development journey!',
    icon: 'i-ph-code-light',
    to: ''
  },
  {
    title: 'Inspection & debug',
    description: 'See the relationships between your components, composables, modules and so much more.',
    icon: 'i-ph-magnifying-glass',
    to: ''
  },
  {
    title: 'Transparency conventions',
    description: 'Understand your Nuxt app structure to debug and optimize your Nuxt application effectively.',
    icon: 'i-ph-wall',
    to: ''
  },
  {
    title: 'Real-time insights',
    description: 'Get real-time insights into your app\'s performance. Analyze your data for seamless user experience.',
    icon: 'i-ph-chart-bar',
    to: ''
  },
  {
    title: 'Tailor-made documentation',
    description: 'Get personalized documentation for your Nuxt application, based on your usage patterns and needs.',
    icon: 'i-ph-book-open',
    to: ''
  },
  {
    title: 'Extendable & hackable',
    description: 'Provide interactive views for integrations. Making it easy to explore and understand your application\'s data and performance.',
    icon: 'i-ph-plug',
    to: ''
  },
]

const projectsCard = [
  {
    title: 'Pages',
    description: 'Access your app\'s routes interactively and use the text box to read and test how each route matches the Pages tab.',
    to: '#'
  },
  {
    title: 'Components',
    description: 'Explore your app\'s components interactively in the Components tab. Easily search and view their source code.',
    to: '#'
  },
  {
    title: 'Imports',
    description: 'Interactively explore Nuxt auto-imports in the Imports tab. See all files, sources, and optional descriptions and documentations.',
    to: '#'
  },
]

const source = ref('npx nuxi@latest devtools enable')
const { copy, copied } = useClipboard({ source })

const intervalId = ref()
const currentStep = ref(0)
const projectsSectionVisible = ref(false)
const projectsSection = ref(null)

const selectProjectCard = (index) => {
  currentStep.value = index

  clearInterval(intervalId.value)
}

const { stop } = useIntersectionObserver(
  projectsSection,
  ([{ isIntersecting }], observerElement) => {
    projectsSectionVisible.value = isIntersecting
  },
)

watch(projectsSectionVisible, () => {
  if (projectsSectionVisible.value) {
    intervalId.value = setInterval(() => {
      if (currentStep.value < 2) {
        currentStep.value++
      } else {
        currentStep.value = 0
      }
    }, 4000)
  }
})


</script>

<template>
  <ULandingHero align="center" direction="vertical"
    :ui="{ container: 'flex lg:gap-12', description: 'mt-6 text-lg/8 lg:px-28 text-gray-400' }">
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
      <UInput aria-label="Copy code to get started" :model-value="source" name="get-started" disabled autocomplete="off"
        size="xl" :ui="{ base: 'disabled:cursor-default', icon: { trailing: { pointer: '' } } }">
        <template #leading>
          <UIcon name="i-ph-terminal" />
        </template>
        <template #trailing>
          <UButton aria-label="Copy Code" :color="copied ? 'green' : 'gray'" variant="ghost" :padded="false"
            :icon="copied ? 'i-ph-check-square-duotone' : 'i-ph-copy-duotone'" @click="copy(source)" />
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
      Enhance projects with<br><span class="text-primary-400">Advanced DevTools</span>
    </template>
    <UPageGrid>
      <UPageCard v-for="card in advancedCards" :key="card.title" :to="card.to" :icon="card.icon" :title="card.title"
        :description="card.description"
        :ui="{ to: 'hover:ring-2 dark:hover:ring-gray-500 hover:ring-gray-500 hover:bg-gray-100/50', icon: { base: 'w-10 h-10 flex-shrink-0 text-gray-100' }, body: { base: 'h-full', background: 'bg-gradient-to-b from-gray-900 to-gray-950' } }">
      </UPageCard>
    </UPageGrid>
  </ULandingSection>

  <ULandingSection align="center">
    <template #title>
      Explore the depths of your<br><span class="text-primary-400">Nuxt project</span>
    </template>
    <div class="flex flex-row gap-x-12" ref="projectsSection">
      <ul class="lg:w-[40%] flex flex-col items-center justify-center">
        <li v-for="(project, index) in  projectsCard" :key="index">
          <UCard class="hidden lg:block relative"
            :ui="{ background: 'bg-transparent dark:bg-transparent', sahdow: 'none', ring: 'ring-0', body: { background: 'bg-transparent dark:bg-transparent', base: 'flex flex-col space-y-2' } }">
            <div class="absolute inset-0 w-full h-full" @click="selectProjectCard(index)" />
            <h4 class="text-xl font-medium" :class="currentStep === index ? 'text-white' : 'text-gray-400'">
              {{ project.title }}
            </h4>
            <p :class="currentStep === index ? 'text-gray-400' : 'text-gray-600'">
              {{ project.description }}
            </p>
            <UButton :to="project.to" trailingIcon="i-ph-arrow-right" variant="link" color="white" size="md"
              :ui="{ size: { md: 'text-md' } }" class="-ml-2.5">
              <span :class="currentStep === index ? 'text-white' : 'text-gray-400'">Learn more</span>
            </UButton>
          </UCard>

          <ULandingSection align="center"
            :icon="index === 0 ? 'i-ph-tree-structure' : index === 1 ? 'i-ph-circles-three' : 'i-ph-function'"
            class="lg:hidden"
            :ui="{ base: 'flex flex-col items-center', wrapper: 'py-8 sm:py-12', icon: { wrapper: 'relative rounded-lg flex items-center justify-center mb-6 w-10 h-10 bg-gray-700 flex-shrink-0' }, title: 'text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl' }">
            <template #title>
              {{ project.title }}
            </template>
            <template #description>
              {{ project.description }}
            </template>
            <div
              class="lg:hidden lg:w-[60%] items-center justify-center border border-slate-200/10 rounded-xl bg-slate-700/20 h-full place-self-center">
              <div class="p-4">
                <NuxtImg :src="`/images/${index === 0 ? 'pages' : index === 1 ? 'components' : 'imports'}.webp`" />
              </div>
            </div>
          </ULandingSection>

        </li>
      </ul>
      <div
        class="hidden lg:flex lg:w-[60%] items-center justify-center border border-slate-200/10 rounded-xl bg-slate-700/20 h-full place-self-center">
        <div class="p-4">
          <NuxtImg :src="`/images/${currentStep === 0 ? 'pages' : currentStep === 1 ? 'components' : 'imports'}.webp`" />
        </div>
      </div>
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
