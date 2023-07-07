<script setup lang="ts">
import type { TimelineEventFunction } from '../../types'

const props = defineProps<{
  record: TimelineEventFunction
}>()

const config = useServerConfig()
const timeAgo = useTimeAgo(() => props.record.start)

function urlToFilepath(url: string) {
  let pathname = new URL(url).pathname
  if (pathname.startsWith('/_nuxt/'))
    pathname = pathname.slice(6)
  if (pathname.startsWith('/@id/virtual:nuxt:'))
    return `#build/${pathname.split('/.nuxt/')[1]}`.replace(/\.m?js$/, '')
  if (pathname.includes('/@fs/'))
    return `/${pathname.split('/@fs/')[1]}`
  return (config.value?.rootDir || '') + pathname
}
</script>

<template>
  <div v-if="record" p-4>
    <div font-mono>
      <span>{{ record.name }}</span>
      <span text-amber-5 dark:text-amber-2> ({{ record.args?.map(i => typeof i === 'symbol' ? '<obj>' : JSON.stringify(i)).join(', ') }})</span>
    </div>

    <DurationDisplay
      v-if="record.end"
      :duration="record.end - record.start"
    />

    <div class="text-xs text-gray-400">
      {{ timeAgo }}
    </div>

    <div class="text-xs text-gray-400" mt2 grid="~ cols-[max-content_1fr] gap-x-4" font-mono>
      <template v-for="item, idx of record.stacktrace" :key="idx">
        <div text-right>
          {{ item.functionName || `(anonymous)` }}
        </div>
        <div ws-nowrap>
          <FilepathItem
            v-if="item.fileName"
            :filepath="`${urlToFilepath(item.fileName)}:${item.lineNumber}:${item.columnNumber}`"
            subpath
          />
        </div>
      </template>
    </div>
  </div>
</template>
