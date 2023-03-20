<script setup lang="ts">
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
</script>

<template>
  <slot :id="processId" :info="info" :update="update" :state="state" :restart="restart">
    <code v-if="info">{{ `v${info.current}` }}</code>
    <template v-if="info?.latest">
      <button v-if="info.needsUpdate" @click="update">
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
</template>
