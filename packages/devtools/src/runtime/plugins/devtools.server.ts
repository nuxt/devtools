import type { TimelineServerState } from '../../types'
import { defineNuxtPlugin } from '#app'
import { useState } from '#imports'

export default defineNuxtPlugin(() => {
  // record ssr start time
  const state = useState<TimelineServerState>('__nuxt_devtools__', () => ({}))
  state.value = {
    timeSsrStart: Date.now(),
  }
})
