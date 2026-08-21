<script setup lang="ts">
import type { ModuleActionType, ModuleStaticInfo, ServerFunctions } from '../../src/types'
import { computed } from 'vue'
import { ModuleDialog } from '~/composables/dialog'
import { connectPromise, rpcClient } from '~/composables/rpc'
import { useInstalledModules } from '~/composables/state-modules'
import { processInstallingModules } from '~/composables/state-subprocess'
import { telemetry } from '~/composables/telemetry'
import { RPC_NAMESPACE } from '../../src/rpc-namespace'

const props = defineProps<{
  item: ModuleStaticInfo
}>()

const emit = defineEmits(['start'])

const installedModules = useInstalledModules()
const installedInfo = computed(() => installedModules.value.find(i => i.name === props.item.npm))
const isInstalled = computed(() => installedInfo.value && installedInfo.value.isPackageModule)
const isUninstallable = computed(() => installedInfo.value && installedInfo.value.isPackageModule && installedInfo.value.isUninstallable)

async function callModuleAction(type: ModuleActionType, name: string, dry: boolean, sessionId?: string) {
  const client = rpcClient.value || await connectPromise
  const method = type === 'install' ? 'installNuxtModule' : 'uninstallNuxtModule'
  return client.call(`${RPC_NAMESPACE}:${method}` as any, name, dry, sessionId) as Promise<Awaited<ReturnType<ServerFunctions['installNuxtModule']>>>
}

async function useModuleAction(item: ModuleStaticInfo, type: ModuleActionType) {
  const result = await callModuleAction(type, item.npm, true)

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

  try {
    // Thread the dry-run's unique session id into the execution call so the
    // server registers the very session we're tracking. The execution RPC
    // awaits the process, so clearing the pending entry here (no `onTerminalExit`
    // needed) settles the UI whether it succeeds or throws.
    await callModuleAction(type, item.npm, false, result.processId)
  }
  finally {
    const index = processInstallingModules.value.findIndex(i => i.processId === result.processId)
    if (index !== -1)
      processInstallingModules.value.splice(index, 1)
  }
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
  </ModuleItemBase>
</template>
