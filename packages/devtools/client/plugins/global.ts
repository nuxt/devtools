export default defineNuxtPlugin(() => {
  const client = useClient()
  const inspectorData = useComponentInspectorData()
  const router = useRouter()

  window.__NUXT_DEVTOOLS_VIEW__ = {
    setClient(_client) {
      if (client.value === _client)
        return

      client.value = _client

      _client.hooks.hook('host:update:reactivity', () => {
        triggerRef(client)
      })
      _client.hooks.hook('host:inspector:update', (data) => {
        inspectorData.value = data
      })
      _client.hooks.hook('host:inspector:click', async (_, file, line, column) => {
        const url = `./${file}:${line}:${column}`
        await rpc.openInEditor(url)
      })

      // eslint-disable-next-line no-console
      console.log('[nuxt-devtools] Client connected', _client)
    },
  }

  router.afterEach(() => {
    const path = router.currentRoute.value.path
    if (path.includes('__'))
      return
    client.value?.hooks.callHook('devtools:navigate', path)
  })
})
