<script setup lang="ts">
import type { BasicModuleInfo, ModuleStaticInfo } from '../../src/types'

const props = defineProps<{
  mod: BasicModuleInfo
  info?: ModuleStaticInfo
  compact?: boolean
}>()

const config = useServerConfig()
const isPackageModule = computed(() => props.mod.entryPath && isNodeModulePath(props.mod.entryPath))
const name = computed(() => {
  if (props.mod.meta?.name)
    return props.mod.meta.name
  if (props.mod.entryPath) {
    return isPackageModule.value
      ? getModuleNameFromPath(props.mod.entryPath)
      : config.value?.rootDir
        ? parseReadablePath(props.mod.entryPath, config.value?.rootDir).path
        : ''
  }
  return ''
})
const data = computed(() => ({
  name,
  ...props.mod?.meta,
  ...props.info,
}))

const iconBase = 'https://api.nuxtjs.org/api/ipx/s_80,f_webp/gh/nuxt/modules/main/icons/'
const avatarBase = 'https://api.nuxtjs.org/api/ipx/s_44,f_webp/gh_avatar/'
const githubBase = 'https://github.com/'
const npmBase = 'https://www.npmjs.com/package/'

const openInEditor = useOpenInEditor()
</script>

<template>
  <NCard p4 flex="~ gap2">
    <div flex="~ col gap2" flex-auto of-hidden px1>
      <div gap-1t flex items-center text-ellipsis ws-nowrap text-lg>
        <NuxtLink
          v-if="isPackageModule"
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
        <span i-carbon-link text-lg op50 />
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
        <span i-carbon-logo-github text-lg op50 />
        <NuxtLink
          :to="data.github"
          target="_blank"
          of-hidden truncate ws-nowrap text-sm op50
          hover="op100 underline text-primary"
        >
          {{ data.github.replace(/^https?:\/\/github.com\//, '') }}
        </NuxtLink>
      </div>

      <slot name="items" />
    </div>
    <div flex="~ col" items-end>
      <div
        v-if="data.icon || isPackageModule"

        h-20 w-20 flex flex-none rounded bg-gray:3 p4
      >
        <img v-if="data.icon" :src="iconBase + data.icon" :alt="name" ma>
        <div i-carbon-circle-dash ma text-4xl op50 />
      </div>
      <div v-if="data.maintainers?.length" flex="~" mt2 flex-auto items-end justify-end>
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
