<script setup lang="ts">
import type { ModuleStaticInfo } from '../../src/types'

const props = defineProps<{
  item: ModuleStaticInfo
}>()

const installedModules = useInstalledModules()
const installedInfo = computed(() => installedModules.value.find(i => i.name === props.item.npm))
const isInstalled = computed(() => installedInfo.value && installedInfo.value.isPackageModule)
const isUninstallable = computed(() => installedInfo.value && installedInfo.value.isPackageModule && installedInfo.value.isUninstallable)
</script>

<template>
  <ModuleItemBase
    :mod="{}"
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
