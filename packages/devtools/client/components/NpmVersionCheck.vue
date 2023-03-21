<script setup lang="ts">
import { useTemplatePromise } from 'vue-template-promise'
import type { NpmCommandOptions } from '../../src/types'

const props = defineProps<{
  packageName: string
  options?: NpmCommandOptions
}>()

const {
  info,
  update,
  state,
  processId,
  restart,
} = usePackageUpdate(props.packageName, props.options)

const PromiseConfirm = useTemplatePromise<boolean, [string]>()

async function updateWithConfirm() {
  await update(async (command) => {
    return PromiseConfirm.start(command)
  })
}
</script>

<template>
  <slot :id="processId" :info="info" :update="updateWithConfirm" :state="state" :restart="restart">
    <code v-if="info">{{ `v${info.current}` }}</code>
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
      <div p4 flex="~ col gap-3">
        <h3 class="text-lg font-medium leading-6">
          Update {{ props.packageName }}?
        </h3>
        <p op50>
          The following command will be executed in your terminal:
        </p>
        <NCodeBlock :code="args[0]" lang="bash" px4 py2 border="~ base rounded" :lines="false" />
        <div flex="~ gap-3" justify-end>
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
