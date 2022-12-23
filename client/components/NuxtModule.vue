<script setup lang="ts">
import type { BasicModuleInfo } from '../../src/types'

const { mod } = defineProps<{
  mod: BasicModuleInfo
}>()

const ignores = [
  'pages',
  'meta',
  'components',
  'imports',
  '@nuxt/devtools',
  '@nuxt/telemetry'
]

const name = $computed(() => mod.meta?.name || mod.entryPath || '')
const collection = await useModulesInfo()
const data = $computed(() => ({
  name,
  ...mod?.meta,
  ...(collection || []).find?.(i => i.npm === name || i.name === name)
}))

const iconBase = 'https://api.nuxtjs.org/api/ipx/s_80,f_webp/gh/nuxt/modules/main/website/public/icons/'
const avatarBase = 'https://api.nuxtjs.org/api/ipx/s_44,f_webp/gh_avatar/'
const githubBase = 'https://github.com/'
const npmBase = 'https://www.npmjs.com/package/'
</script>

<template>
  <div
    v-if="!ignores.includes(name)"
    border="~ base"
    p3
    flex="~ gap2"
  >
    <div flex-auto flex="~ col gap1" px1 of-hidden>
      <NuxtLink
        :to="npmBase + (data.npm || data.name)"
        target="_blank"
        text-lg text-ellipsis
        of-hidden ws-nowrap
        hover="underline text-primary"
      >
        {{ data.name }}
      </NuxtLink>
      <div op50 text-sm>
        {{ data.description ? data.description : '(no description)' }}
      </div>
      <NuxtLink
        v-if="data.website"
        :to="data.website"
        target="_blank"
        text-sm op50
        hover="op100 underline text-primary"
      >
        <span carbon-link /> {{ data.website.replace(/^https?:\/\//, '') }}
      </NuxtLink>

      <div v-if="data.maintainers?.length" mt2 flex="~">
        <NuxtLink
          v-for="m of data.maintainers"
          :key="m.name"
          target="_blank"
          :to="githubBase + m.github"
          :title="m.name"
        >
          <img :src="avatarBase + m.github" w-6 h-6 rounded-full>
        </NuxtLink>
      </div>
    </div>
    <div
      h-20 w-20 p4
      rounded bg-gray:10 flex-none
    >
      <img v-if="data.icon" :src="iconBase + data.icon" :alt="name">
    </div>
  </div>
</template>
