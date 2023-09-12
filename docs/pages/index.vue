<script setup lang="ts">
definePageMeta({
  colorMode: 'dark'
})
const videoModalOpen = ref(false)
const title = 'Nuxt DevTools: Unleash Nuxt Developer Experience'
const description = 'Nuxt DevTools: Elevate your Nuxt App insight and Developer Experience. Enhance transparency, identify performance gaps, and seamlessly manage app configurations.'
useSeoMeta({
  titleTemplate: '',
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogImage: 'https://devtools.nuxt.com/social-card.png',
  twitterImage: 'https://devtools.nuxt.com/social-card.png',
})

const { data } = await useAsyncData('landing', () => {
  return Promise.all([
    queryContent('/home/get-started').findOne(),
    queryContent('/').findOne()
  ])
})
const [getStarted, page] = data.value

const source = ref('npx nuxi@latest devtools enable')
const { copy, copied } = useClipboard({ source })

const intervalId = ref()
const currentStep = ref(0)
const projectsSectionVisible = ref(false)
const nuxtProjectsSection = ref(null)

const { data: module } = await useFetch<{
  stats: {
    downloads: number
    stars: number
  }
  contributors: {
    username: string
  }[]
}>('https://api.nuxt.com/modules/devtools', {
  transform: ({ stats, contributors }) => ({ stats, contributors }),
})

function selectProjectCard (index) {
  currentStep.value = index

  clearInterval(intervalId.value)
}

const { stop } = useIntersectionObserver(
  nuxtProjectsSection,
  ([{ isIntersecting }], observerElement) => {
    projectsSectionVisible.value = isIntersecting
  },
)

const { format: formatNumber } = Intl.NumberFormat('en-GB', { notation: 'compact' })


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
    :ui="{ container: 'flex flex-col lg:gap-12', description: 'mt-6 text-lg/8 lg:px-28 text-gray-400' }">
    <span class="gradient" />
    <template #title>
      <span v-html="page.hero?.title" />
    </template>
    <template #description>
      {{ page.hero?.description }}
    </template>
    <template #links>
      <UButton to="/guide/getting-started" icon="i-ph-rocket-launch-duotone" size="xl">
        {{ page.hero?.button }}
      </UButton>
      <UButton size="xl" color="white" icon="i-ph-video-duotone" @click="videoModalOpen = true">
        What is Nuxt DevTools?
      </UButton>
      <UModal v-model="videoModalOpen" :ui="{ width: 'sm:max-w-[560px]' }">
        <div>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube-nocookie.com/embed/Wkla7ATW8Vc?si=po2wmux2Ybfq0Evm"
            title="Nuxt Devtools by LearnVue"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          />
        </div>
      </UModal>
    </template>
  </ULandingHero>

  <ULandingSection v-for="(section, index) of page.sections" :key="index" v-bind="section">
    <template v-if="section.title" #title>
      <span v-html="section?.title" />
    </template>

    <template v-if="section.description" #description>
      <span v-html="section.description" />
    </template>

    <template #tools>
      <!-- TODO: Links on card ? -->
      <UPageGrid>
        <ULandingCard v-for="card in section.toolsCards" :key="card.title" :to="card.to" :icon="card.icon"
          :title="card.title" :description="card.description"
          :ui="{ to: 'hover:ring-2 dark:hover:ring-gray-500 hover:ring-gray-500 hover:bg-gray-100/50', icon: { base: 'w-10 h-10 flex-shrink-0 text-gray-100' }, body: { base: 'h-full', background: 'bg-gradient-to-b from-gray-900 to-gray-950' } }" />
      </UPageGrid>
    </template>

    <!-- TODO: change image -->
    <template #project>
      <div>
        <div ref="nuxtProjectsSection" class="flex flex-row gap-x-12">
          <ul class="flex flex-col items-center justify-center lg:w-[40%]">
            <li v-for="(project, index) in section.projectCards" :key="index">
              <UCard class="relative hidden lg:block cursor-pointer group"
                :ui="{ background: 'bg-transparent dark:bg-transparent', sahdow: 'none', ring: 'ring-0', body: { background: 'bg-transparent dark:bg-transparent', base: 'flex flex-col space-y-2' } }">
                <div class="absolute inset-0 h-full w-full" @click="selectProjectCard(index)" />
                <h4 class="text-xl font-medium group-hover:text-white transition-color duration-200"
                  :class="currentStep === index ? 'text-white ' : 'text-gray-400'">
                  {{ project.title }}
                </h4>
                <p class="group-hover:text-gray-400 transition-color duration-200"
                  :class="currentStep === index ? 'text-gray-400' : 'text-gray-600'">
                  {{ project.description }}
                </p>
                <UButton trailing variant="link" color="white" size="md" :ui="{ size: { md: 'text-md' } }"
                  class="-ml-2.5 z-20" :to="project.to">
                  <span class="group-hover:text-white transition-color duration-200" :class="currentStep === index ? 'text-white' : 'text-gray-400'">Learn more</span>
                  <UIcon name="i-ph-arrow-right" class="w-5 h-5 group-hover:text-white"
                    :class="currentStep === index ? 'text-white' : 'text-gray-400'" />
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
                  class="relative h-full place-self-center items-center justify-center border border-slate-200/10 rounded-xl bg-slate-700/20 lg:hidden">
                  <div class="p-4">
                    <NuxtImg :src="`/images/${index === 0 ? 'pages' : index === 1 ? 'components' : 'imports'}.webp`"
                      class="rounded-lg" />
                  </div>
                </div>
              </ULandingSection>
            </li>
          </ul>
          <div
            class="relative hidden h-full place-self-center items-center justify-center border border-slate-200/10 rounded-xl bg-slate-700/20 lg:w-[60%] lg:flex">
            <div class="p-4">
              <NuxtImg :src="`/images/${currentStep === 0 ? 'pages' : currentStep === 1 ? 'components' : 'imports'}.webp`"
                class="rounded-lg" />
            </div>
          </div>
        </div>

        <div class="w-full flex justify-center pt-8">
          <UButton size="xl" variant="outline" color="transparent" to="/guide/features">
            {{ section.button }}
          </UButton>
        </div>
      </div>
    </template>

    <template #cta>
      <ULandingCTA align="left" card :ui="{
        background: 'bg-gradient-to-b from-gray-900 to-gray-950',
        body: { background: 'bg-gradient-to-b from-gray-900 to-gray-950' },
        links: 'mt-10 flex flex-col space-y-4 items-center justify-center lg:justify-start gap-x-6',
        title: 'text-2xl font-medium tracking-tight text-white sm:text-3xl text-center lg:text-left',
      }">
        <template #title>
          <span v-html="section.title" />
        </template>

        <template #links>
          <UAvatarGroup :max="13" size="md" class="flex-wrap lg:self-start [&_span:first-child]:text-xs">
            <UTooltip v-for="(contributor, index) of module.contributors" :key="index" :text="contributor.username"
              class="rounded-full" :ui="{ background: 'bg-gray-50 dark:bg-gray-800/50' }"
              :popper="{ offsetDistance: 16 }">
              <UAvatar :alt="contributor.username" :src="`https://github.com/${contributor.username}.png`"
                class="lg:hover:ring-primary-500 dark:lg:hover:ring-primary-400 transition-transform lg:hover:scale-125 lg:hover:ring-2"
                size="md">
                <NuxtLink :to="`https://github.com/${contributor.username}`" target="_blank" class="focus:outline-none"
                  tabindex="-1">
                  <span class="absolute inset-0" aria-hidden="true" />
                </NuxtLink>
              </UAvatar>
            </UTooltip>
          </UAvatarGroup>
          <p class="text-center text-sm">
            {{ section.avatarText }}
          </p>
        </template>

        <div class="flex flex-col items-center justify-center gap-8 sm:flex-row lg:gap-16">
          <NuxtLink class="group text-center" to="https://npmjs.org/package/@nuxt/devtools" target="_blank">
            <p
              class="group-hover:text-primary-500 dark:group-hover:text-primary-400 text-6xl font-semibold text-gray-900 dark:text-white">
              {{ formatNumber(module.stats.downloads) }}+
            </p>
            <p>Monthly Downloads</p>
          </NuxtLink>

          <NuxtLink class="group text-center" to="https://github.com/nuxt/devtools" target="_blank">
            <p
              class="group-hover:text-primary-500 dark:group-hover:text-primary-400 text-6xl font-semibold text-gray-900 dark:text-white">
              {{ formatNumber(module.stats.stars) }}+
            </p>
            <p>Stars</p>
          </NuxtLink>
        </div>
      </ULandingCTA>
    </template>

    <template #get-started>
      <div class="w-full flex flex-col items-center justify-center">
        <div class="flex flex-col space-y-6">
          <div class="flex space-x-4">
            <div class="relative hidden flex-col justify-between py-[20px] md:flex">
              <svg width="1" height="154" viewBox="0 0 1 154" fill="none" xmlns="http://www.w3.org/2000/svg"
                class="absolute left-4 z-[-1]">
                <path d="M0.500244 0.568115L0.500244 153.568" stroke="#334155" stroke-dasharray="4 4" />
              </svg>
              <div
                class="h-8 w-8 flex items-center justify-center border border-1 border-gray-700 rounded-full bg-gray-800 px-4 py-2">
                1
              </div>
              <div
                class="h-8 w-8 flex items-center justify-center border border-1 border-gray-700 rounded-full bg-gray-800 px-4 py-2">
                2
              </div>
            </div>
            <div class="prose">
              <ContentRenderer :value="getStarted" />
            </div>
          </div>
        </div>
        <UButton to="/guide/getting-started" size="xl" :label="section.button" variant="outline" color="transparent" class="mt-8 w-fit" />
      </div>
    </template>
  </ULandingSection>
</template>

<style scoped lang="postcss">
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
