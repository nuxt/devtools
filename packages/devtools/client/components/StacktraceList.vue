<script setup lang="ts">
import type { StackFrame } from 'error-stack-parser-es'

defineProps<{
  stacktrace: StackFrame[]
}>()

const config = useServerConfig()

function urlToFilepath(url: string) {
  try {
    let pathname = new URL(url).pathname
    if (pathname.startsWith('/_nuxt/'))
      pathname = pathname.slice(6)
    if (pathname.startsWith('/@id/virtual:nuxt:'))
      return `#build/${pathname.split('/.nuxt/')[1]}`.replace(/\.m?js$/, '')
    if (pathname.includes('/@fs/'))
      return `/${pathname.split('/@fs/')[1]}`
    return (config.value?.rootDir || '') + pathname
  }
  catch {
    return url
  }
}
</script>

<template>
  <div mt2 grid="~ cols-[max-content_1fr] gap-x-4" font-mono>
    <template v-for="item, idx of stacktrace" :key="idx">
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
</template>
