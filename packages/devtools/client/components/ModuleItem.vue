<script setup lang="ts">
import type { BasicModuleInfo } from '../../src/types'

const props = defineProps<{
  mod: BasicModuleInfo
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
const collection = await useModulesInfo()
const data = computed(() => ({
  name,
  ...props.mod?.meta,
  ...(collection || []).find?.(i => i.npm === name.value || i.name === name.value),
}))

const iconBase = 'https://api.nuxtjs.org/api/ipx/s_80,f_webp/gh/nuxt/modules/main/icons/'
const avatarBase = 'https://api.nuxtjs.org/api/ipx/s_44,f_webp/gh_avatar/'
const githubBase = 'https://github.com/'
const npmBase = 'https://www.npmjs.com/package/'
</script>

<template>
  <NCard p4 flex="~ gap2">
    <div flex="~ col gap2" flex-auto of-hidden px1>
      <div
        of-hidden text-ellipsis ws-nowrap text-lg
      >
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
          @click="rpc.openInEditor(mod.entryPath!)"
        >
          {{ data.name }}
        </button>
        <span v-else>
          {{ data.name }}
        </span>
      </div>

      <div v-if="data.description " line-clamp-2 mt--1 text-sm op50>
        {{ data.description }}
      </div>

      <div flex-auto />

      <div v-if="data.website" flex="~ gap-2" title="Documentation">
        <span i-carbon-link text-lg op50 />
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
      <div v-if="mod.entryPath" flex="~ gap-2" title="Open on filesystem">
        <span i-carbon-folder-move-to text-lg op50 />
        <FilepathItem :filepath="mod.entryPath" text-sm op50 hover="text-primary op100" />
      </div>

      <!-- NPM Version bump -->
      <NpmVersionCheck v-if="data.npm" :key="data.npm" :package-name="data.npm" :options="{ dev: true }">
        <template #default="{ info, update, state, id, restart }">
          <NuxtLink
            v-if="state === 'running'" flex="~ gap-2"
            animate-pulse items-center
            :to="id ? `/modules/terminals?id=${encodeURIComponent(id)}` : undefined"
          >
            <span i-carbon-circle-dash animate-spin text-lg op50 />
            <code text-sm op50>Upgrading...</code>
          </NuxtLink>
          <div v-else-if="state === 'updated'" mx--2>
            <button
              flex="~ gap-2"
              hover="bg-primary/20"
              items-center rounded bg-primary:10 px2 text-sm text-primary
              @click="restart"
            >
              <span i-carbon-intent-request-active text-lg text-primary />
              <code text-xs>Update installed, click to restart</code>
            </button>
          </div>
          <div v-else-if="info?.needsUpdate" mx--2>
            <button
              flex="~ gap-2" title="Click to upgrade" items-center rounded px2 text-sm
              hover="bg-active"
              @click="update()"
            >
              <span i-carbon-intent-request-upgrade text-lg op50 />
              <code op50>v{{ info.current }}</code>
              <div i-carbon-arrow-right op50 />
              <code text-green>v{{ info.latest }}</code>
            </button>
          </div>
          <div v-else-if="info?.latest" flex="~ gap-2" items-center title="NPM">
            <span i-carbon-cube text-lg op50 />
            <code text-sm op50>v{{ info.current }}</code>
          </div>
        </template>
      </NpmVersionCheck>
    </div>
    <div flex="~ col">
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
    </div>
  </NCard>
</template>
