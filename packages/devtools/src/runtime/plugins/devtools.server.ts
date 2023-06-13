// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
// @ts-ignore tsconfig
import { defineNuxtPlugin } from '#app'

// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
// @ts-ignore tsconfig
import { useState } from '#imports'

export default defineNuxtPlugin(() => {
  // TODO: retrieve this in client
  const state = useState('__nuxt_devtools__', () => {})
  state.value = {
    timeSsrStart: Date.now(),
  }
})
