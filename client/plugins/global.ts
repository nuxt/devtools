import type { NuxtDevtoolsGlobal } from '../../src/types'

export default defineNuxtPlugin(() => {
  const state = useClient()
  const inspectorData = useComponentInspectorData()
  const router = useRouter()

  window.__NUXT_DEVTOOLS__ = <NuxtDevtoolsGlobal>{
    setClient(client) {
      state.value = client
      // eslint-disable-next-line no-console
      console.log('DevTools client connected', client)
    },
    componentInspectorClose() {
      router.go(-1)
    },
    componentInspectorUpdate(data) {
      inspectorData.value = data
    },
    async componentInspectorClick(_, file, line, column) {
      const url = `./${file}:${line}:${column}`
      await rpc.openInEditor(url)
    },
  }
})
