<script setup lang="ts">
import type { NuxtLayout } from '@nuxt/schema'
import type { RouteInfo } from '~/../src/types'

const { pages, layouts, matched, matchedPending } = defineProps<{
  pages: RouteInfo[]
  layouts: NuxtLayout[]
  matched: RouteInfo[]
  matchedPending: RouteInfo[]
}>()

defineEmits<{
  (e: 'navigate', path: string): void
}>()

const sorted = $computed(() => {
  return [...pages].sort((a, b) => a.path.localeCompare(b.path))
})

function openLayout(name: string) {
  const layout = layouts.find(i => i.name === name)
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
          <th>
            Layout
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of sorted" :key="item.name" h-7 border="b dashed transparent hover:base">
          <td w-16 text-right pr-1>
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
          </td>
          <td w-0 ws-nowrap text-sm items-center>
            <RoutePathItem
              :route="item"
              :class="matched.find(m => m.name === item.name) ? 'text-primary' : matchedPending.find(m => m.name === item.name) ? 'text-teal' : ''"
              @navigate="path => $emit('navigate', path)"
            />
          </td>
          <td text-center font-mono>
            <span v-if="item.meta.layout === false">-</span>
            <button v-else-if="item.meta.layout" @click="openLayout(item.meta.layout as string)">
              {{ item.meta.layout }}
            </button>
            <button v-else op15 text-sm @click="openLayout('default')">
              (default)
            </button>
          </td>
          <td flex="~ gap-2" h-full items-center justify-end>
            <button
              v-if="!item.path.includes(':')"
              text-sm op40 hover="op100 text-primary"
              title="Navigate to page"
              @click="$emit('navigate', item.path)"
            >
              <div i-carbon-arrow-up-right />
            </button>
            <button
              v-if="item.file"
              text-sm op40 hover="op100 text-primary"
              title="Open in editor"
              @click="openInEditor(item.file!)"
            >
              <div i-carbon-script-reference />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
