import type { NuxtDevtoolsGlobal } from '../../src/types'

export default defineNuxtPlugin(() => {
  const client = useClient()
  const inspectorData = useComponentInspectorData()
  const router = useRouter()

  window.__NUXT_DEVTOOLS__ = <NuxtDevtoolsGlobal>{
    setClient(_client) {
      client.value = _client
      // eslint-disable-next-line no-console
      console.log('DevTools client connected', _client)
    },
    triggerUpdate() {
      // TODO: use triggerRef after: https://github.com/vuejs/core/pull/7507
      // triggerRef(client)
      if (client.value)
        client.value = { ...client.value }
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
