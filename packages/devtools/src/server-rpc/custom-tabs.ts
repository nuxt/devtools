import type { ModuleCustomTab, NuxtDevtoolsServerContext, ServerFunctions } from '../types'

export function setupCustomTabRPC({ nuxt, options, refresh }: NuxtDevtoolsServerContext) {
  const iframeTabs: ModuleCustomTab[] = []
  const customTabs: ModuleCustomTab[] = []

  // Add static custom tabs from the config
  if (options.customTabs?.length)
    customTabs.push(...options.customTabs)

  async function initHooks() {
    nuxt.hook('devtools:customTabs:refresh', initCustomTabs)
    await initCustomTabs()
  }

  async function initCustomTabs() {
    customTabs.length = 0
    if (options.customTabs?.length)
      customTabs.push(...options.customTabs)
    await nuxt.callHook('devtools:customTabs', customTabs)
    refresh('getCustomTabs')
  }

  nuxt.hook('app:resolve', async () => {
    await initHooks()
  })

  return {
    getCustomTabs() {
      return [
        ...iframeTabs,
        ...customTabs,
      ]
    },
    async customTabAction(name, actionIndex) {
      const tab = customTabs.find(i => i.name === name)
      if (!tab)
        return false
      const view = tab.view
      if (view.type !== 'launch')
        return false
      const action = view.actions?.[actionIndex]
      if (!action)
        return false

      Promise.resolve(action.handle?.())
        .catch((e) => {
          console.error(e)
        })
        .finally(() => {
          nuxt.callHook('devtools:customTabs:refresh')
        })
      nuxt.callHook('devtools:customTabs:refresh')
      return true
    },
  } satisfies Partial<ServerFunctions>
}
