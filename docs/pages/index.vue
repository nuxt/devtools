<script setup lang="ts">
import { pick } from 'lodash-es'

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

const { data: getStarted } = await useAsyncData('landing-get-started', () => queryContent('/home/get-started').findOne())
const { data: page } = await useAsyncData('index', () => queryContent('/').findOne())

const source = ref('npx nuxi@latest devtools enable')
const { copy, copied } = useClipboard({ source })

const intervalId = ref()
const currentStep = ref(0)
const projectsSectionVisible = ref(false)
const nuxtProjectsSection = ref(null)

onMounted(() => console.log({ nuxtProjectsSection }))

const { data: module } = await useFetch<{
  stats: {
    downloads: number
    stars: number
  }
  contributors: {
    username: string
  }[]
}>('https://api.nuxt.com/modules/devtools', {
  transform: (module) => pick(module, ['stats', 'contributors'])
})


const selectProjectCard = (index) => {
  currentStep.value = index

  clearInterval(intervalId.value)
}

const { stop } = useIntersectionObserver(
  nuxtProjectsSection,
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

const formatNumber = function (num: number, fractionDigits = 0) {
  if (num > 999 && num < 1000000) {
    return (num / 1000).toFixed(fractionDigits) + 'k' // convert to K for number from > 1000 < 1 million
  } else if (num > 1000000) {
    return (num / 1000000).toFixed(fractionDigits) + 'm' // convert to M for number from > 1 million
  } else {
    return String(num)
  }
}
</script>

<template>
  <ULandingHero align="center" direction="vertical"
    :ui="{ container: 'flex flex-col lg:gap-12', description: 'mt-6 text-lg/8 lg:px-28 text-gray-400' }">
    <span class="gradient" />
    <template #title>
      <span v-html="page.hero?.title" />
    </template>
    <template #description>
      {{ page.hero?.description }}
    </template>
    <template #links>
      <UButton to="/get-started/installation" icon="i-ph-rocket-launch-duotone" size="xl">
        {{ page.hero?.button }}
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
    <div class="pt-12">
      <VideoPlayer :source="{ type: 'mp4', src: '/videos/nuxt.mp4' }" poster="/videos/poster-volta.webp" />
      <div class="mt-4">{{ page.hero?.videoText }}</div>
    </div>

  </ULandingHero>

  <ULandingSection v-for="(section, index) of page.sections" :key="index" v-bind="section">
    <template v-if="section.title" #title>
      <span v-html="section?.title" />
    </template>

    <template v-if="section.description" #description>
      <span v-html="section.description" />
    </template>

    <template #tools>
      <UPageGrid>
        <UPageCard v-for="card in section.toolsCards" :key="card.title" :to="card.to" :icon="card.icon"
          :title="card.title" :description="card.description"
          :ui="{ to: 'hover:ring-2 dark:hover:ring-gray-500 hover:ring-gray-500 hover:bg-gray-100/50', icon: { base: 'w-10 h-10 flex-shrink-0 text-gray-100' }, body: { base: 'h-full', background: 'bg-gradient-to-b from-gray-900 to-gray-950' } }">
        </UPageCard>
      </UPageGrid>
    </template>

    <template #project>
      <div class="flex flex-row gap-x-12" ref="nuxtProjectsSection">
        <ul class="lg:w-[40%] flex flex-col items-center justify-center">
          <li v-for="(project, index) in  section.projectCards" :key="index">
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
            <NuxtImg
              :src="`/images/${currentStep === 0 ? 'pages' : currentStep === 1 ? 'components' : 'imports'}.webp`" />
          </div>
        </div>
      </div>
    </template>

    <template #cta>
      <ULandingCTA align="left" card :ui="{
        background: 'bg-gradient-to-b from-gray-900 to-gray-950',
        body: { background: 'bg-gradient-to-b from-gray-900 to-gray-950' },
        links: 'mt-10 flex flex-col space-y-4 items-center justify-center lg:justify-start gap-x-6',
        title: 'text-2xl font-medium tracking-tight text-white sm:text-3xl text-center lg:text-left'
      }">
        <template #title>
          <span v-html="section.title" />
        </template>

        <template #links>
          <UAvatarGroup :max="13" size="md" class="flex-wrap [&_span:first-child]:text-xs lg:self-start">
            <UTooltip v-for="(contributor, index) of module.contributors" :key="index" :text="contributor.username"
              class="rounded-full" :ui="{ background: 'bg-gray-50 dark:bg-gray-800/50' }"
              :popper="{ offsetDistance: 16 }">
              <UAvatar :alt="contributor.username" :src="`https://github.com/${contributor.username}.png`"
                class="lg:hover:scale-125 lg:hover:ring-2 lg:hover:ring-primary-500 dark:lg:hover:ring-primary-400 transition-transform"
                size="md">
                <NuxtLink :to="`https://github.com/${contributor.username}`" target="_blank" class="focus:outline-none"
                  tabindex="-1">
                  <span class="absolute inset-0" aria-hidden="true" />
                </NuxtLink>
              </UAvatar>
            </UTooltip>
          </UAvatarGroup>
          <p class="text-sm text-center">
            {{ section.avatarText }}
          </p>
        </template>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-8 lg:gap-16">
          <NuxtLink class="text-center group" to="https://npmjs.org/package/@nuxt/devtools" target="_blank">
            <p
              class="text-6xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 dark:group-hover:text-primary-400">
              {{ formatNumber(module.stats.downloads) }}+
            </p>
            <p>{{ section.firstStat }}</p>
          </NuxtLink>

          <NuxtLink class="text-center group" to="https://github.com/nuxt/devtools" target="_blank">
            <p
              class="text-6xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 dark:group-hover:text-primary-400">
              {{ formatNumber(module.stats.stars) }}+
            </p>
            <p>{{ section.secondStat }}</p>
          </NuxtLink>
        </div>
      </ULandingCTA>
    </template>

    <template #get-started>
      <div class="flex w-full flex-col justify-center items-center">
        <div class="flex flex-col space-y-6">
          <div class="flex space-x-4">
            <div class="hidden md:flex flex-col relative py-[20px] justify-between ">
              <svg width="1" height="154" viewBox="0 0 1 154" fill="none" xmlns="http://www.w3.org/2000/svg"
                class="absolute left-4 z-[-1]">
                <path d="M0.500244 0.568115L0.500244 153.568" stroke="#334155" stroke-dasharray="4 4" />
              </svg>
              <div
                class="flex items-center justify-center rounded-full py-2 px-4 w-8 h-8 bg-gray-800 border border-1 border-gray-700">
                1</div>
              <div
                class="flex items-center justify-center rounded-full py-2 px-4 w-8 h-8 bg-gray-800 border border-1 border-gray-700">
                2</div>
            </div>
            <div class="prose">
              <ContentRenderer :value="getStarted" />
            </div>
          </div>
        </div>
        <UButton to="/guide/get-started/" size="xl" :label="section.button" variant="outline" color="transparent"
          class="w-fit mt-8" />
      </div>
    </template>
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

.prose {
  @apply text-white;

  :where(code) {
    @apply text-gray-200;
  }
}
</style>