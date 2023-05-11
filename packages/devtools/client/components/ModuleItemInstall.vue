<script setup lang="ts">
import type { ModuleStaticInfo } from '../../src/types'

const props = defineProps<{
  item: ModuleStaticInfo
}>()

const installedModules = useInstalledModules()
const isInstalled = computed(() => !!(installedModules.value.find(i => i.isPackageModule && i.name === props.item.npm)))
</script>

<template>
  <ModuleItemBase
    :mod="{}"
    :role="isInstalled ? '' : 'button'"
    :info="item"
    mb2 h-full
    :class="isInstalled ? 'op50' : 'hover:bg-active!'"
    :compact="true"
    @click="isInstalled ? null : useModuleAction(item, 'install')"
  >
    <template v-if="isInstalled" #badge>
      <Badge bg-green-400:10 text-green-400>
        Installed
      </Badge>
      <NDropdown n="sm green">
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
