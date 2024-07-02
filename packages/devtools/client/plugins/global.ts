export default defineNuxtPlugin(() => {
  const client = useClient()
  const inspectorData = useComponentInspectorData()
  const router = useRouter()

  function onUpdateReactivity() {
    triggerRef(client)
    client.value.revision.value += 1
  }

  function onInspectorUpdate(data: any) {
    inspectorData.value = data
  }

  function onInspectorClick(url: URL) {
    const query = url.searchParams.get('file')
    if (query)
      rpc.openInEditor(query)
    else
      console.error('[nuxt-devtools] Failed to open file from Vue Inspector', url)
  }

  Object.defineProperty(window, '__NUXT_DEVTOOLS_VIEW__', {
    value: {
      setClient(_client) {
        if (client.value === _client)
          return

        client.value = _client

        _client.hooks.hook('host:update:reactivity', onUpdateReactivity)
        _client.hooks.hook('host:inspector:update', onInspectorUpdate)
        _client.hooks.hook('host:inspector:click', onInspectorClick)
        _client.hooks.hook('host:action:reload', () => location.reload())
        _client.hooks.hook('host:action:navigate', (path: string) => router.push(path))

        // eslint-disable-next-line no-console
        console.log('[nuxt-devtools] Client connected', _client)
      },
    } as typeof window['__NUXT_DEVTOOLS_VIEW__'],
    enumerable: false,
    configurable: true,
  })

  router.afterEach(() => {
    const path = router.currentRoute.value?.path
    if (!path || path.includes('__'))
      return
    client.value?.hooks.callHook('devtools:navigate', path)
  })
})
