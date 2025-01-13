<script setup lang="ts">
import type { NuxtDebugModuleMutationRecord } from '@nuxt/schema'

defineProps<{
  moduleMutationRecords: NuxtDebugModuleMutationRecord[]
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
          Value
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="record, idx of moduleMutationRecords" :key="idx" border="b dashed transparent hover:base">
        <td>
          <FilepathItem v-if="record.module && isPath(record.module)" :filepath="record.module" />
          <NBadge v-else n="sm" v-text="record.module" />
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
        <td max-h-20 max-w-200 of-auto>
          <NCodeBlock :code="String(record.value)" lang="json" :lines="false" />
        </td>
      </tr>
    </tbody>
  </table>
</template>
