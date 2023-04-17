<script setup lang="ts">
import type { NpmCommandOptions } from '../../src/types'

const props = withDefaults(
  defineProps<{
    packageName: string
    options?: NpmCommandOptions
    showVersion?: boolean
  }>(),
  {
    showVersion: true,
  },
)

const router = useRouter()
const {
  info,
  update,
  state,
  processId,
  restart,
} = usePackageUpdate(props.packageName, props.options)

const shouldGotoTerminal = ref(true)
const shouldRestartServer = ref(true)
const restartDialogs = useRestartDialogs()

const PromiseConfirm = createTemplatePromise<boolean, [string]>()

async function updateWithConfirm() {
  const processId = await update(async (command) => {
    return PromiseConfirm.start(command)
  })
  if (processId && shouldRestartServer.value) {
    restartDialogs.value.push({
      id: processId,
      message: `${props.packageName} has been updated. Do you want to restart the Nuxt server now?`,
    })
  }
  if (processId && shouldGotoTerminal.value)
    router.push(`/modules/terminals?id=${encodeURIComponent(processId)}`)
}
</script>

<template>
  <slot :id="processId" :info="info" :update="updateWithConfirm" :state="state" :restart="restart">
    <code v-if="info && showVersion">{{ `v${info.current}` }}</code>
    <template v-if="info?.latest">
      <button v-if="info.needsUpdate" @click="updateWithConfirm()">
        <Badge
          bg-green-400:10 text-green-400
          title="updates available"
          v-text="'updates available'"
        />
      </button>
      <Badge
        v-else
        bg-gray-400:10 text-gray-400
        title="latest"
        v-text="'latest'"
      />
    </template>
  </slot>

  <PromiseConfirm v-slot="{ resolve, args }">
    <NDialog :model-value="true" @close="resolve(false)">
      <div p4 flex="~ col gap-1">
        <h3 class="text-lg font-medium leading-6">
          Update {{ props.packageName }}?
        </h3>
        <p op50>
          The following command will be executed in your terminal:
        </p>
        <NCodeBlock :code="args[0]" lang="bash" my3 px4 py2 border="~ base rounded" :lines="false" />
        <NCheckbox v-model="shouldGotoTerminal" n="primary">
          Navigate to terminal
        </NCheckbox>
        <NCheckbox v-model="shouldRestartServer" n="primary">
          Restart Nuxt server after update
        </NCheckbox>

        <div flex="~ gap-3" mt2 justify-end>
          <NTip n="sm purple" flex-auto icon="carbon-chemistry">
            Experimental feature. Please make sure to backup your project first.
          </NTip>
          <NButton @click="resolve(false)">
            Cancel
          </NButton>
          <NButton n="solid primary" @click="resolve(true)">
            Update
          </NButton>
        </div>
      </div>
    </NDialog>
  </PromiseConfirm>
</template>
