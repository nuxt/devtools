<script setup lang="ts">
import type { FunctionMetricCallRecord } from '../../types'

const props = defineProps<{
  record: FunctionMetricCallRecord
}>()

const config = useServerConfig()
const timeAgo = useTimeAgo(() => props.record.start)

function urlToFilepath(url: string) {
  const { pathname } = new URL(url)
  if (pathname.startsWith('/_nuxt/@id/virtual:nuxt:'))
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
            :filepath="`${urlToFilepath(item.fileName)}:${item.lineNumber}:${item.columnNumber}`"
            subpath
          />
        </div>
      </template>
    </div>
  </div>
</template>
