<script setup lang="ts">
import type { InstalledModuleInfo } from '../../src/types'
import type { VersionScoreSlim } from '~/composables/state-module-scores'
import { computed, ref } from 'vue'
import { useCurrentTerminalId } from '~/composables/state-routes'

const props = defineProps<{
  mod: InstalledModuleInfo
}>()

const staticInfo = computed(() => props.mod.info)
const data = computed(() => ({
  ...props.mod?.meta,
  ...props.mod,
  ...staticInfo.value,
}))
const terminalId = useCurrentTerminalId()
const healthDropdownShown = ref(false)
const moduleScoreRef = ref<{ versionScore: VersionScoreSlim | null } | null>(null)
</script>

<template>
  <ModuleItemBase :mod="mod" :info="staticInfo">
    <template #items>
      <div v-if="mod.entryPath" flex="~ gap-2" title="Open on filesystem">
        <span i-carbon-folder-move-to flex-none text-lg op50 />
        <FilepathItem :filepath="mod.entryPath" text-sm op50 hover="text-primary op100" />
      </div>

      <!-- NPM Version + Health Score -->
      <NpmVersionCheck v-if="data.npm" :key="data.npm" :package-name="data.npm" :options="{ dev: true }">
        <template #default="{ info, update, state, id, restart }">
          <!-- Health Score with installed version -->
          <ModuleScoreItem ref="moduleScoreRef" :npm="data.npm" :version="info?.current" />
          <NuxtLink
            v-if="state === 'running'" flex="~ gap-2"
            animate-pulse items-center
            :to="id ? '/modules/terminals' : undefined"
            @click="id ? terminalId = id : undefined"
          >
            <span i-carbon-circle-dash flex-none animate-spin text-lg op50 />
            <code text-sm op50>Upgrading...</code>
          </NuxtLink>
          <div v-else-if="state === 'updated'" mx--2>
            <button
              flex="~ gap-2"
              hover="bg-primary/20"
              items-center rounded bg-primary:10 px2 text-sm text-primary
              @click="restart"
            >
              <span i-carbon-intent-request-active flex-none text-lg text-primary />
              <code text-xs>Update installed, click to restart</code>
            </button>
          </div>
          <div v-else-if="info?.needsUpdate" mx--2 flex="~ gap-1 items-center">
            <button
              flex="~ gap-2" title="Click to upgrade" items-center rounded px2 text-sm
              hover="bg-active"
              @click="update()"
            >
              <span i-carbon-intent-request-upgrade flex-none text-lg op50 />
              <code op50>v{{ info.current }}</code>
              <div i-carbon-arrow-right op50 />
              <code text-green>v{{ info.latest }}</code>
            </button>
            <VDropdown v-model:shown="healthDropdownShown">
              <button
                v-tooltip="'Health comparison'"
                flex-none rounded p1.5 text-rose-500
                hover="bg-rose-500/10"
              >
                <span i-carbon-health-cross text-lg />
              </button>
              <template #popper>
                <ModuleUpgradePopup
                  :npm="data.npm"
                  :current-version="info.current"
                  :latest-version="info.latest"
                  :score-data="moduleScoreRef?.versionScore"
                  @upgrade="update(); healthDropdownShown = false"
                />
              </template>
            </VDropdown>
          </div>
          <div v-else-if="info?.latest" flex="~ gap-2" items-center title="NPM">
            <span i-carbon-cube flex-none text-lg op50 />
            <code text-sm op50>v{{ info.current }}</code>
          </div>
        </template>
      </NpmVersionCheck>
    </template>
  </ModuleItemBase>
</template>
