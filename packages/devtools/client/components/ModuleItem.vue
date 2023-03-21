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
  <div border="~ base" p4 flex="~ gap2">
    <div flex="~ col gap2" flex-auto of-hidden px1>
      <div
        of-hidden text-lg ws-nowrap text-ellipsis
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

      <!-- NPM Version bump -->
      <NpmVersionCheck v-if="data.npm" :key="data.npm" :package-name="data.npm" :options="{ dev: true }">
        <template #default="{ info, update, state, id, restart }">
          <NuxtLink
            v-if="state === 'running'" flex="~ gap-2"
            items-center animate-pulse
            :to="id ? `/modules/terminals?id=${encodeURIComponent(id)}` : undefined"
          >
            <span text-lg op50 i-carbon-circle-dash animate-spin />
            <code text-sm op50>Upgrading...</code>
          </NuxtLink>
          <div v-else-if="state === 'updated'" mx--2>
            <button
              flex="~ gap-2"
              hover="bg-primary/20"
              items-center text-sm text-primary bg-primary:10 px2 rounded
              @click="restart"
            >
              <span text-lg text-primary i-carbon-intent-request-active />
              <code text-xs>Update installed, click to restart</code>
            </button>
          </div>
          <div v-else-if="info?.needsUpdate" mx--2>
            <button
              flex="~ gap-2" title="Click to upgrade" text-sm items-center px2 rounded
              hover="bg-active"
              @click="update()"
            >
              <span text-lg op50 i-carbon-intent-request-upgrade />
              <code op50>v{{ info.current }}</code>
              <div op50 i-carbon-arrow-right />
              <code text-green>v{{ info.latest }}</code>
            </button>
          </div>
          <div v-else-if="info?.latest" flex="~ gap-2" items-center title="NPM">
            <span text-lg op50 i-carbon-cube />
            <code text-sm op50>v{{ info.current }}</code>
          </div>
        </template>
      </NpmVersionCheck>
    </div>
    <div flex="~ col">
      <div
        v-if="data.icon || isPackageModule"

        p4 rounded flex-none flex h-20 w-20 bg-gray:3
      >
        <img v-if="data.icon" :src="iconBase + data.icon" :alt="name" ma>
        <div op50 ma i-carbon-circle-dash text-4xl />
      </div>
      <div v-if="data.maintainers?.length" flex="~" flex-auto items-end mt2 justify-end>
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
