<script setup lang="ts">
import type { BasicModuleInfo } from '../../src/types'

const { mod } = defineProps<{
  mod: BasicModuleInfo
}>()

const config = useServerConfig()
const isPackageModule = $computed(() => mod.entryPath && isNodeModulePath(mod.entryPath))
const name = $computed(() => {
  if (mod.meta?.name)
    return mod.meta.name
  if (mod.entryPath) {
    return isPackageModule
      ? getModuleNameFromPath(mod.entryPath)
      : config.value?.rootDir
        ? getShortPath(mod.entryPath, config.value?.rootDir)
        : ''
  }
  return ''
})
const collection = await useModulesInfo()
const data = $computed(() => ({
  name,
  ...mod?.meta,
  ...(collection || []).find?.(i => i.npm === name || i.name === name),
}))

const iconBase = 'https://api.nuxtjs.org/api/ipx/s_80,f_webp/gh/nuxt/modules/main/icons/'
const avatarBase = 'https://api.nuxtjs.org/api/ipx/s_44,f_webp/gh_avatar/'
const githubBase = 'https://github.com/'
const npmBase = 'https://www.npmjs.com/package/'
</script>

<template>
  <div border="~ base" p4 flex="~ gap2">
    <div flex-auto flex="~ col gap2" px1 of-hidden>
      <div
        text-lg text-ellipsis
        of-hidden ws-nowrap
      >
        <NuxtLink
          v-if="isPackageModule"
          :to="npmBase + (data.npm || data.name)"
          target="_blank"
          hover="underline text-primary"
        >
          {{ data.name }}
        </NuxtLink>
        <a
          v-else-if="mod.entryPath"
          hover="underline text-primary"
          @click="rpc.openInEditor(mod.entryPath!)"
        >
          {{ data.name }}
        </a>
        <span v-else>
          {{ data.name }}
        </span>
      </div>

      <div v-if="data.description " op50 text-sm mt--1>
        {{ data.description }}
      </div>
      <div v-else-if="!isPackageModule && mod.entryPath" mt--1>
        <FilepathItem :filepath="mod.entryPath" text-sm op50 hover="text-primary op100" />
      </div>

      <div flex-auto />

      <div v-if="data.website" flex="~ gap-1">
        <span i-carbon-notebook text-lg op50 />
        <NuxtLink
          :to="data.website"
          target="_blank"
          text-sm op50
          hover="op100 underline text-primary"
        >
          {{ data.website.replace(/^https?:\/\//, '') }}
        </NuxtLink>
      </div>
      <div v-if="data.github" flex="~ gap-1">
        <span i-carbon-logo-github text-lg op50 />
        <NuxtLink
          :to="data.github"
          target="_blank"
          text-sm op50
          hover="op100 underline text-primary"
        >
          {{ data.github.replace(/^https?:\/\/github.com\//, '') }}
        </NuxtLink>
      </div>
    </div>
    <div flex="~ col">
      <div
        v-if="data.icon || isPackageModule"
        h-20 w-20
        p4 rounded bg-gray:3 flex-none
        flex
      >
        <img v-if="data.icon" :src="iconBase + data.icon" :alt="name" ma>
        <div i-carbon-circle-dash text-4xl op50 ma />
      </div>
      <div v-if="data.maintainers?.length" mt2 flex="~" justify-end items-end flex-auto>
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
  </div>
</template>
