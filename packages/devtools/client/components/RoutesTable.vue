<script setup lang="ts">
import type { NuxtLayout } from 'nuxt/schema'
import type { RouteInfo } from '~/../src/types'

const props = defineProps<{
  pages: RouteInfo[]
  layouts: NuxtLayout[]
  matched: RouteInfo[]
  matchedPending: RouteInfo[]
}>()

defineEmits<{
  (e: 'navigate', path: string): void
}>()

const sorted = computed(() => {
  return [...props.pages].sort((a, b) => a.path.localeCompare(b.path))
})

function openLayout(name: string) {
  const layout = props.layouts.find(i => i.name === name)
  if (layout)
    openInEditor(layout.file)
}
</script>

<template>
  <div>
    <table w-full>
      <thead border="b base">
        <tr>
          <th text-left />
          <th text-left>
            Route Path
          </th>
          <th text-left>
            Name
          </th>
          <th>
            Layout
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of sorted" :key="item.name" class="group" h-7 border="b dashed transparent hover:base">
          <td w-20 pr-1>
            <div items-center flex justify-end>
              <Badge
                v-if="matched.find(m => m.name === item.name)"
                bg-green-400:10 text-green-400
                title="active"
                v-text="'active'"
              />
              <Badge
                v-if="matchedPending.find(m => m.name === item.name)"
                bg-teal-400:10 text-teal-400
                title="next"
                v-text="'next'"
              />
            </div>
          </td>
          <td text-sm>
            <div flex="inline gap3" items-center>
              <RoutePathItem
                :route="item"
                :class="matched.find(m => m.name === item.name) ? 'text-primary' : matchedPending.find(m => m.name === item.name) ? 'text-teal' : ''"
                @navigate="path => $emit('navigate', path)"
              />
              <div op0 group-hover:op100 flex="~ gap1">
                <button
                  v-if="item.file || item.meta?.file"
                  text-sm op40 hover="op100 text-primary"
                  title="Open in editor"
                  @click="openInEditor((item.file || item.meta?.file) as string)"
                >
                  <div i-carbon-script-reference />
                </button>
              </div>
            </div>
          </td>
          <td text-left text-sm pr-1 op50 font-mono w-0 ws-nowrap>
            {{ item.name }}
          </td>
          <td font-mono w-0 ws-nowrap text-sm text-center>
            <span v-if="item.meta.layout === false">-</span>
            <button v-else-if="item.meta.layout" @click="openLayout(item.meta.layout as string)">
              {{ item.meta.layout }}
            </button>
            <button v-else text-sm op15 @click="openLayout('default')">
              (default)
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
