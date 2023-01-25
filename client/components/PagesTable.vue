<script setup lang="ts">
import type { NuxtLayout } from '@nuxt/schema'
import type { RouteInfo } from '~~/../src/types'

const { pages, layouts, matched, matchedPending } = defineProps<{
  pages: RouteInfo[]
  layouts: NuxtLayout[]
  matched: RouteInfo[]
  matchedPending: RouteInfo[]
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
          <th text-left>
            Route Path
          </th>
          <th>
            Layout
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of sorted" :key="item.name" h-7>
          <td w-0 ws-nowrap text-sm items-center>
            <span>
              <button v-if="item.file" hover="underline text-primary" @click="openInEditor(item.file!)">
                {{ item.path }}
              </button>
              <span v-else>
                {{ item.path }}
              </span>
            </span>

            <Badge
              v-if="matched.find(m => m.name === item.name)"
              bg-green-400:10 text-green-400
              title="active"
              v-text="'active'"
            />
            <Badge
              v-if="matchedPending.find(m => m.name === item.name)"
              bg-teal-400:10 text-teal-400
              title="pending active"
              v-text="'pending active'"
            />
          </td>
          <td text-center font-mono w-0>
            <span v-if="item.meta.layout === false">-</span>
            <button v-else-if="item.meta.layout" @click="openLayout(item.meta.layout as string)">
              {{ item.meta.layout }}
            </button>
            <button v-else op25 text-sm @click="openLayout('default')">
              (default)
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
