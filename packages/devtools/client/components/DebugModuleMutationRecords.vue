<script setup lang="ts">
import type { ServerDebugModuleMutationRecord } from '@nuxt/devtools-kit/types'

defineProps<{
  moduleMutationRecords: ServerDebugModuleMutationRecord[]
}>()

function isPath(path: string) {
  return path.startsWith('/') || path.match(/^[a-z]:[\\/]/i)
}
</script>

<template>
  <table>
    <thead>
      <tr>
        <th ws-nowrap p1 text-center font-bold>
          Module
        </th>
        <th ws-nowrap p1 text-center font-bold>
          Key Path
        </th>
        <th ws-nowrap p1 text-center font-bold>
          Method
        </th>
        <th ws-nowrap p1 text-center font-bold>
          Value
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="record, idx of moduleMutationRecords" :key="idx" border="b dashed transparent hover:base">
        <td>
          <FilepathItem v-if="record.name && isPath(record.name)" :filepath="record.name" />
          <NBadgeHashed v-else font-mono :text="record.name" />
        </td>
        <td>
          <code flex="~" px4>
            <template v-for="key, idy of record.keys" :key="idy">
              <div>{{ key }}</div>
              <div v-if="idy < record.keys.length - 1" op50>
                .
              </div>
            </template>
          </code>
        </td>
        <td text-center>
          <NBadgeHashed v-if="record.method" font-mono :text="record.method" />
        </td>
        <td max-h-20 max-w-200 of-auto>
          <NCodeBlock :code="String(record.value)" lang="json" :lines="false" :inline="true" />
        </td>
      </tr>
    </tbody>
  </table>
</template>
