<script setup lang="ts">
import { parse as parseStrackTrace } from 'error-stack-parser-es'

definePageMeta({
  icon: 'i-carbon-warning-alt-filled text-red',
  title: 'Error',
  category: 'app',
  show() {
    const client = useClient()
    return () => client.value?.nuxt?.payload?.error
  },
})

const client = useClient()
const error = computed(() => {
  const err = client.value?.nuxt?.payload?.error as {
    url?: string
    statusCode?: number
    statusMessage?: string
    message?: string
    description?: string
    data?: any
  } & Error
  if (err) {
    console.error('[Nuxt DevTools] Error in payload:')
    console.error(err)
    console.error({ ...err })
  }
  return err
})

const stacks = computed(() => {
  if (!error.value?.stack)
    return []
  try {
    // Nuxt server returns a HTML rendered stacktrace, workaround by removing all HTML tags
    if (error.value.stack.startsWith('<pre>')) {
      return parseStrackTrace({
        stack: error.value.stack.replace(/<.*?>/g, ''),
      } as any)
    }
    return parseStrackTrace(error.value)
  }
  catch (e) {
    console.error(e)
    return []
  }
})
</script>

<template>
  <div p6>
    <div v-if="error">
      <NTip n="red" icon="i-carbon-warning-alt-filled" mb5>
        Error occurred in this page
      </NTip>
      <div text-6xl>
        {{ error.statusCode || 'Client Error' }}
      </div>
      <div v-if="error.statusMessage" op75>
        {{ error.statusMessage }}
      </div>
      <div my4 text-xl text-red>
        {{ error.message || error.description || 'Unknown error' }}
      </div>
      <div v-if="stacks.length || error.stack" of-auto rounded bg-active p2>
        <div px1 op50>
          Stacktrace
        </div>
        <StacktraceList v-if="stacks.length" px2 :stacktrace="stacks" />
        <pre v-else v-text="error.stack" />
      </div>
    </div>
    <div v-else op50>
      No error
    </div>
  </div>
</template>
