<script setup lang="ts">
import type { InstalledModuleInfo, ModuleStaticInfo } from '../../src/types'
import { computed } from 'vue'
import { useOpenInEditor } from '~/composables/editor'

const props = withDefaults(
  defineProps<{
    mod: InstalledModuleInfo
    info?: ModuleStaticInfo
    compact?: boolean
    maintainers?: boolean
  }>(),
  {
    maintainers: true,
  },
)

const data = computed(() => ({
  ...props.mod?.meta,
  ...props.mod,
  ...props.info,
}))

const iconBase = 'https://api.nuxtjs.org/api/ipx/s_80,f_webp/gh/nuxt/modules/main/icons/'
const avatarBase = 'https://api.nuxtjs.org/api/ipx/s_44,f_webp/gh_avatar/'
const githubBase = 'https://github.com/'
const npmBase = 'https://www.npmjs.com/package/'

const { format: formatNumber } = Intl.NumberFormat(navigator.language || 'en', { notation: 'compact', maximumFractionDigits: 1 })

const stars = computed(() => formatNumber(data.value.stats?.stars || 0))
const downloads = computed(() => formatNumber(data.value.stats?.downloads || 0))

const openInEditor = useOpenInEditor()
</script>

<template>
  <NCard p4 flex="~ gap2">
    <div flex="~ col gap2" flex-auto of-hidden px1>
      <slot name="main">
        <div gap-1t flex items-center text-ellipsis ws-nowrap text-lg>
          <NuxtLink
            v-if="mod.isPackageModule"
            :to="npmBase + (data.npm || data.name)"
            target="_blank"
            hover="underline text-primary"
          >
            {{ data.name }}
          </NuxtLink>
          <button
            v-else-if="mod.entryPath"
            role="button"
            hover="underline text-primary"
            @click="openInEditor(mod.entryPath!)"
          >
            {{ data.name }}
          </button>
          <span v-else>
            {{ data.name }}
          </span>
          <slot name="badge" />
        </div>

        <div
          v-if="data.description "
          :class="compact ? 'ws-nowrap of-hidden truncate' : 'line-clamp-2'"
          mt--1 text-sm op50
        >
          {{ data.description }}
        </div>

        <div flex-auto />

        <div v-if="data.website" flex="~ gap-2" title="Documentation">
          <span i-carbon-link flex-none text-lg op50 />
          <NuxtLink
            :to="data.website"
            target="_blank"
            of-hidden truncate ws-nowrap text-sm op50
            hover="op100 underline text-primary"
          >
            {{ data.website.replace(/^https?:\/\//, '') }}
          </NuxtLink>
        </div>
        <div v-if="data.github" flex="~ gap-2">
          <span i-carbon-logo-github flex-none text-lg op50 />
          <NuxtLink
            :to="data.github"
            target="_blank"
            of-hidden truncate ws-nowrap text-sm op50
            hover="op100 underline text-primary"
          >
            {{ data.github.replace(/^https?:\/\/github.com\//, '') }}
          </NuxtLink>
        </div>
      </slot>

      <slot name="items" />

      <div v-if="data.stats" flex="~ gap-4 items-center">
        <div v-if="data.stats.stars" flex="~ gap-2 items-center" op50>
          <NIcon icon="carbon-star" flex-none text-lg />
          <span>
            {{ stars }}
          </span>
        </div>
        <div v-if="data.stats.downloads" flex="~ gap-2 items-center" op50>
          <NIcon icon="carbon-download" flex-none text-lg />
          <span>
            {{ downloads }}
          </span>
        </div>
      </div>

      <div v-if="mod.timings?.setup">
        <DurationDisplay
          title="Module Setup Time"
          flex="~ items-center"
          :duration="mod.timings.setup"
          :factor="0.5"
        >
          <template #before>
            <NIcon icon="carbon-time" mr2 flex-none text-lg op50 />
          </template>
        </DurationDisplay>
      </div>
    </div>
    <div flex="~ col" items-end>
      <div
        v-if="data.icon || mod.isPackageModule"

        h-20 w-20 flex flex-none rounded bg-gray:3 p4
      >
        <img v-if="data.icon" :src="iconBase + data.icon" :alt="mod.name" ma>
        <div v-else i-carbon-cube ma flex-none text-4xl op30 />
      </div>
      <div v-if="data.maintainers?.length && maintainers" flex="~" mt2 flex-auto items-end justify-end>
        <NuxtLink
          v-for="m of data.maintainers"
          :key="m.name"
          target="_blank"
          :to="githubBase + m.github"
          :title="m.name"
        >
          <img :src="avatarBase + m.github" h-6 w-6 rounded-full>
        </NuxtLink>
      </div>
      <template v-if="$slots.actions">
        <div flex-auto />
        <div flex justify-end>
          <slot name="actions" />
        </div>
      </template>
    </div>
  </NCard>
</template>
