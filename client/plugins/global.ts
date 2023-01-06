import type { NuxtAppClient, NuxtDevtoolsGlobal } from '../../src/types'

export default defineNuxtPlugin(() => {
  const state = useState<NuxtAppClient>('devtools-client')

  // @ts-expect-error injection
  window.__NUXT_DEVTOOLS__ = <NuxtDevtoolsGlobal>{
    setClient(client) {
      state.value = client
      // eslint-disable-next-line no-console
      console.log('DevTools client connected', client)
    },
  }
})
