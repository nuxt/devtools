<script setup lang="ts">
import type { ModuleActionType, ModuleStaticInfo } from '../../src/types'
import { computed } from 'vue'
import { ensureDevAuthToken } from '~/composables/dev-auth'
import { ModuleDialog } from '~/composables/dialog'
import { rpc } from '~/composables/rpc'
import { useInstalledModules } from '~/composables/state-modules'
import { processInstallingModules } from '~/composables/state-subprocess'
import { telemetry } from '~/composables/telemetry'

const props = defineProps<{
  item: ModuleStaticInfo
}>()

const emit = defineEmits(['start'])

const installedModules = useInstalledModules()
const installedInfo = computed(() => installedModules.value.find(i => i.name === props.item.npm))
const isInstalled = computed(() => installedInfo.value && installedInfo.value.isPackageModule)
const isUninstallable = computed(() => installedInfo.value && installedInfo.value.isPackageModule && installedInfo.value.isUninstallable)

async function useModuleAction(item: ModuleStaticInfo, type: ModuleActionType) {
  const method = type === 'install' ? rpc.installNuxtModule : rpc.uninstallNuxtModule
  const result = await method(await ensureDevAuthToken(), item.npm, true)

  telemetry(`modules:${type}`, {
    moduleName: item.npm,
  })

  if (!result.commands)
    return

  if (!await ModuleDialog.start(item, result, type))
    return

  processInstallingModules.value.push({
    name: item.npm,
    info: item,
    processId: result.processId,
  })

  emit('start')

  await method(await ensureDevAuthToken(), item.npm, false)
}

const anyObj = {} as any
</script>

<template>
  <ModuleItemBase
    :mod="anyObj"
    :role="isInstalled ? '' : 'button'"
    :info="item"
    mb2 h-full
    :class="isInstalled ? 'border-dashed op75' : 'hover:bg-active!'"
    :compact="true"
    @click="isInstalled ? null : useModuleAction(item, 'install')"
  >
    <template v-if="isInstalled" #badge>
      <NBadge n="green" v-text="'Installed'" />
      <NDropdown v-if="isUninstallable" n="sm green">
        <template #trigger="{ click }">
          <NButton icon="carbon-overflow-menu-vertical" :border="false" @click="click()" />
        </template>
        <NButton icon="carbon-trash-can" n="red" @click="useModuleAction(item, 'uninstall')">
          Uninstall
        </NButton>
      </NDropdown>
    </template>
    <template #items>
      <ModuleScoreItem :npm="item.npm" />
    </template>
  </ModuleItemBase>
</template>
