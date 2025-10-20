<script setup lang="ts">
const { data: mod } = await useFetch<{
  stats: {
    downloads: number
    stars: number
  }
  contributors: {
    username: string
  }[]
}>('https://api.nuxt.com/modules/devtools', {
  transform: ({ stats, contributors }: any) => ({ stats, contributors }),
})

const { format: formatNumber } = Intl.NumberFormat('en-GB', { notation: 'compact' })
</script>

<template>
  <UPageCTA
    align="left"
    orientation="horizontal"
    card
    :ui="{
      links: 'mt-10 flex flex-col space-y-4 items-center justify-center lg:justify-start gap-x-6',
      title: 'text-2xl font-medium tracking-tight text-white sm:text-3xl text-center lg:text-left',
      root: 'bg-linear-to-b from-gray-900 to-gray-950',
    }"
  >
    <template #title>
      <span>
        Trusted and supported by our amazing community
      </span>
    </template>

    <template #links>
      <UAvatarGroup v-if="mod" :max="13" size="md" class="flex-wrap lg:self-start [&_span:first-child]:text-xs">
        <UTooltip
          v-for="(contributor, idx) of mod.contributors"
          :key="idx"
          :text="contributor.username"
          :popper="{ offsetDistance: 16 }"
        >
          <UAvatar
            :alt="contributor.username"
            :src="`https://github.com/${contributor.username}.png`"
            class="lg:hover:ring-primary-500 dark:lg:hover:ring-primary-400 transition-transform lg:hover:scale-125 lg:hover:ring-2"
            size="md"
          >
            <NuxtLink
              :to="`https://github.com/${contributor.username}`"
              target="_blank"
              class="focus:outline-none"
              tabindex="-1"
            >
              <span class="absolute inset-0" aria-hidden="true" />
            </NuxtLink>
          </UAvatar>
        </UTooltip>
      </UAvatarGroup>
      <p class="text-center text-sm">
        Created and maintained by 50+ contributors
      </p>
    </template>

    <div v-if="mod" class="flex flex-col items-center justify-center gap-8 sm:flex-row lg:gap-16">
      <NuxtLink class="group text-center" to="https://npmjs.org/package/@nuxt/devtools" target="_blank">
        <p class="group-hover:text-primary-500 dark:group-hover:text-primary-400 text-6xl text-gray-900 font-semibold dark:text-white">
          {{ formatNumber(mod.stats.downloads) }}+
        </p>
        <p class="mt-2 text-sm font-normal">
          Monthly Downloads
        </p>
      </NuxtLink>

      <NuxtLink class="group text-center" to="https://github.com/nuxt/devtools" target="_blank">
        <p class="group-hover:text-primary-500 dark:group-hover:text-primary-400 text-6xl text-gray-900 font-semibold dark:text-white">
          {{ formatNumber(mod.stats.stars) }}+
        </p>
        <p class="mt-2 text-sm font-normal">
          Stars
        </p>
      </NuxtLink>
    </div>

    <slot />
  </UPageCTA>
</template>

<style lang="scss" scoped>
</style>
