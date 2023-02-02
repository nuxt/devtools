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
    <div flex="~ col gap2" flex-auto of-hidden px1>
      <div

        text-lg of-hidden ws-nowrap text-ellipsis
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

      <div flex-auto />

      <div v-if="data.website" flex="~ gap-2" title="Documentation">
        <span text-lg op50 i-carbon-link />
        <NuxtLink
          :to="data.website"
          target="_blank"
          text-sm op50
          hover="op100 underline text-primary"
        >
          {{ data.website.replace(/^https?:\/\//, '') }}
        </NuxtLink>
      </div>
      <div v-if="data.github" flex="~ gap-2">
        <span text-lg op50 i-carbon-logo-github />
        <NuxtLink
          :to="data.github"
          target="_blank"
          text-sm op50
          hover="op100 underline text-primary"
        >
          {{ data.github.replace(/^https?:\/\/github.com\//, '') }}
        </NuxtLink>
      </div>
      <div v-if="mod.entryPath" flex="~ gap-2" title="Open on filesystem">
        <span text-lg op50 i-carbon-folder-move-to />
        <FilepathItem :filepath="mod.entryPath" text-sm op50 hover="text-primary op100" />
      </div>
    </div>
    <div flex="~ col">
      <div
        v-if="data.icon || isPackageModule"

        p4 rounded flex-none h-20 w-20 bg-gray:3 flex
      >
        <img v-if="data.icon" :src="iconBase + data.icon" :alt="name" ma>
        <div op50 ma i-carbon-circle-dash text-4xl />
      </div>
      <div v-if="data.maintainers?.length" flex="~" items-end flex-auto mt2 justify-end>
        <NuxtLink
          v-for="m of data.maintainers"
          :key="m.name"
          target="_blank"
          :to="githubBase + m.github"
          :title="m.name"
        >
          <img :src="avatarBase + m.github" rounded-full w-6 h-6>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
