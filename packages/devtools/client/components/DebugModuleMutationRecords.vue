<script setup lang="ts">
import type { ServerDebugModuleMutationRecord } from '@nuxt/devtools-kit/types'
import { computed, ref } from 'vue'

const props = defineProps<{
  moduleMutationRecords: ServerDebugModuleMutationRecord[]
}>()

function isPath(path: string) {
  return path.startsWith('/') || path.match(/^[a-z]:[\\/]/i)
}

// const search = ref('')
const showBuiltin = ref(false)
const showTemplates = ref(false)
const showTranspile = ref(false)
const showPlugins = ref(false)
const moduleFilter = ref('')

const items = computed(() => {
  let arr = props.moduleMutationRecords
  if (!showBuiltin.value) {
    arr = arr.filter(i => !i.name.startsWith('nuxt:') && i.name !== '@nuxt/devtools')
  }
  if (!showTemplates.value) {
    arr = arr.filter(i => i.keys.join('.') !== 'build.templates')
  }
  if (!showTranspile.value) {
    arr = arr.filter(i => i.keys.join('.') !== 'build.transpile')
  }
  if (!showPlugins.value) {
    arr = arr.filter(i => i.keys.join('.') !== 'plugins')
  }
  if (moduleFilter.value) {
    arr = arr.filter(i => i.name === moduleFilter.value)
  }
  return arr
})
</script>

<template>
  <div flex="~ gap-2 col" mb4>
    <!-- <NTextInput v-model="search" placeholder="Search" w-full /> -->
    <div flex="~ gap-3 items-center">
      <NCheckbox v-model="showBuiltin" n="primary">
        <span ws-nowrap op75>Builtin Modules</span>
      </NCheckbox>
      <NCheckbox v-model="showTemplates" n="primary">
        <span ws-nowrap op75>Templates</span>
      </NCheckbox>
      <NCheckbox v-model="showTranspile" n="primary">
        <span ws-nowrap op75>Transpile</span>
      </NCheckbox>
      <NCheckbox v-model="showPlugins" n="primary">
        <span ws-nowrap op75>Plugins</span>
      </NCheckbox>
      <div v-if="moduleFilter" flex="~ gap-1" items-center p1 border="~ base rounded">
        <NBadgeHashed font-mono :text="moduleFilter" />
        <NButton icon="carbon-close" :border="false" @click="moduleFilter = ''" />
      </div>
    </div>
  </div>
  <table max-w-full of-auto>
    <thead border="b base">
      <tr>
        <th ws-nowrap p1 text-center font-bold>
          Index
        </th>
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
      <tr
        v-for="record of items"
        :key="moduleMutationRecords.indexOf(record)"
        border="b dashed transparent hover:base"
      >
        <td text-center op50>
          <div>{{ moduleMutationRecords.indexOf(record) + 1 }}</div>
        </td>
        <td>
          <FilepathItem v-if="record.name && isPath(record.name)" :filepath="record.name" />
          <NBadgeHashed
            v-else
            role="button" font-mono
            :text="record.name"
            @click="moduleFilter = record.name"
          />
        </td>
        <td>
          <code flex="~" px4>
            <template v-for="key, idy of record.keys" :key="idy">
              <span>{{ key }}</span>
              <span v-if="idy < record.keys.length - 1" op50>
                .
              </span>
            </template>
          </code>
        </td>
        <td px2 text-center>
          <NBadgeHashed font-mono :text="record.method || '='" :class="record.method ? '' : 'saturate-0'" />
        </td>
        <td of-auto>
          <NCodeBlock
            :code="String(record.value)"
            lang="json"
            ws-normal break-all py1
            :lines="false" :inline="true"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>
