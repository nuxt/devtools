import type { NuxtAppClient, NuxtDevtoolsGlobal } from '../../src/types'

export default defineNuxtPlugin(() => {
  const state = useState<NuxtAppClient>('devtools-client')

  // @ts-expect-error injection
  window.__nuxt_devtools__ = <NuxtDevtoolsGlobal>{
    setClient(nuxt) {
      state.value = nuxt
    },
  }
})
