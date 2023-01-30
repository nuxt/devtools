<script setup lang="ts">
import type { NuxtLayout } from '@nuxt/schema'
import type { RouteInfo } from '~~/../src/types'

const { pages, layouts, matched, matchedPending } = defineProps<{
  pages: RouteInfo[]
  layouts: NuxtLayout[]
  matched: RouteInfo[]
  matchedPending: RouteInfo[]
}>()

defineEmits<{
  (e: 'navigate', route: RouteInfo): void
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
            <button
              :class="matched.find(m => m.name === item.name) ? 'text-primary' : matchedPending.find(m => m.name === item.name) ? 'text-teal' : ''"
              @click="$emit('navigate', item)"
            >
              <code>
                <span
                  v-for="part, idx of parseExpressRoute(item.path)" :key="idx"
                  :class="part[0] === ':' ? 'text-blue border border-blue:50 px1' : ''"
                >
                  {{ part[0] === ':' ? part.slice(1) : part }}
                </span>
              </code>
            </button>
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
              v-if="item.file" text-sm op25 hover="op100 text-primary"
              title="Open in editor"
              @click="openInEditor(item.file!)"
            >
              <div i-carbon-launch />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
