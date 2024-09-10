import { defineNuxtPlugin, useState } from '#imports'
import type { TimelineServerState } from '@nuxt/devtools/types'

export default defineNuxtPlugin(() => {
  // record ssr start time
  const state = useState<TimelineServerState>('__nuxt_devtools__', () => ({}))
  state.value = {
    timeSsrStart: Date.now(),
  }
})
