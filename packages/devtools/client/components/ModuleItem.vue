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
const staticInfo = computed(() => (collection || []).find?.(i => i.npm === name.value || i.name === name.value))
const data = computed(() => ({
  name,
  ...props.mod?.meta,
  ...staticInfo.value,
}))
</script>

<template>
  <ModuleItemBase :mod="mod" :info="staticInfo">
    <template #items>
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
    </template>
  </ModuleItemBase>
</template>
