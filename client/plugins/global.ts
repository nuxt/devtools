import type { NuxtDevtoolsGlobal } from '../../src/types'

export default defineNuxtPlugin(() => {
  const client = useClient()
  const inspectorData = useComponentInspectorData()
  const router = useRouter()

  window.__NUXT_DEVTOOLS__ = <NuxtDevtoolsGlobal>{
    setClient(_client) {
      if (client.value === _client)
        return

      client.value = _client

      _client.hooks.hook('update:all', () => {
        // TODO: use triggerRef after: https://github.com/vuejs/core/pull/7507
        // triggerRef(client)
        if (client.value)
          client.value = { ...client.value }
      })
      _client.hooks.hook('inspector:close', () => {
        router.go(-1)
      })
      _client.hooks.hook('inspector:update', (data) => {
        inspectorData.value = data
      })
      _client.hooks.hook('inspector:click', async (_, file, line, column) => {
        const url = `./${file}:${line}:${column}`
        await rpc.openInEditor(url)
      })

      // eslint-disable-next-line no-console
      console.log('DevTools client connected', _client)
    },
  }

  router.afterEach(() => {
    const path = router.currentRoute.value.path
    if (path.includes('__'))
      return
    client.value?.hooks.callHook('navigate', path)
  })
})
