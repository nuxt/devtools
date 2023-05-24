<script setup lang="ts">
import type { ModuleActionType, ModuleStaticInfo } from '../../src/types'

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
  const result = await method(item.npm, true)

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

  await method(item.npm, false)
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
      <Badge bg-green-400:10 text-green-400>
        Installed
      </Badge>
      <NDropdown v-if="isUninstallable" n="sm green">
        <template #trigger="{ click }">
          <NIconButton icon="carbon-overflow-menu-vertical" @click="click()" />
        </template>
        <NButton icon="carbon-trash-can" n="red" @click="useModuleAction(item, 'uninstall')">
          Uninstall
        </NButton>
      </NDropdown>
    </template>
  </ModuleItemBase>
</template>
