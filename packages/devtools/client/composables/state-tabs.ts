import { objectPick } from '@antfu/utils'
import type { MaybeRef } from 'vue'
import type { ModuleBuiltinTab, ModuleCustomTab, RouteInfo, TabCategory } from '../../src/types'

export function useAllTabs() {
  const customTabs = useCustomTabs()
  const settings = useDevToolsUIOptions()
  const router = useRouter()

  const builtin = computed(() => [
    ...router.getRoutes()
      .filter(route => route.path.startsWith('/modules/') && route.meta.title && !route.meta.wip)
      .filter(route => !route.meta.experimental || (route.meta.experimental && settings.showExperimentalFeatures.value))
      .sort((a, b) => (a.meta.order || 100) - (b.meta.order || 100))
      .map((i): ModuleBuiltinTab => {
        return {
          name: i.name as string,
          path: i.path,
          ...i.meta,
        }
      }),
    // <ModuleBuiltinTab>{
    //   name: 'builtin-inspector',
    //   title: 'Inspect Vue components',
    //   icon: 'i-tabler-focus-2',
    //   category: 'app',
    //   show() {
    //     return () => !!client.value?.inspector?.instance
    //   },
    //   onClick() {
    //     if (!client.value?.inspector?.instance)
    //       return
    //     client.value.inspector.enable()
    //   },
    // },
    ...(customTabs.value || []).filter(i => i.name.startsWith('builtin-')),
  ])

  const custom = computed(() => (customTabs.value || [])
    .filter(i => !i.name.startsWith('builtin-')))

  return computed(() => [
    ...builtin.value,
    ...custom.value,
  ])
}

function getCategorizedRecord(): Record<TabCategory, (ModuleCustomTab | ModuleBuiltinTab)[]> {
  return {
    pinned: [],
    app: [],
    analyze: [],
    server: [],
    modules: [],
    documentation: [],
    advanced: [],
  }
}

export function getCategorizedTabs(tabs: MaybeRef<(ModuleCustomTab | ModuleBuiltinTab)[]>) {
  const {
    pinnedTabs,
  } = useDevToolsUIOptions()
  return computed(() => {
    const categories = getCategorizedRecord()
    for (const tab of unref(tabs)) {
      let category = (tab.category || 'app')
      if (pinnedTabs.value.includes(tab.name))
        category = 'pinned'
      if (!categories[category])
        console.warn(`Unknown tab category: ${category}`)
      else
        categories[category].push(tab)
    }

    for (const key of Object.keys(categories)) {
      if (categories[key as TabCategory].length === 0)
        delete categories[key as TabCategory]
    }

    if (categories.pinned.length > 0)
      categories.pinned.sort((a, b) => pinnedTabs.value.indexOf(a.name) - pinnedTabs.value.indexOf(b.name))

    return Object.entries(categories)
  })
}

export function useEnabledTabs() {
  const tabs = useAllTabs()
  const settings = useDevToolsUIOptions()
  const categoryOrder = Object.keys(getCategorizedRecord())
  const tabShows = tabs.value.map(tab => (tab as ModuleBuiltinTab)?.show?.())

  return computed(() => tabs.value
    .filter((tab, idx) => {
      const _tab = tab as ModuleBuiltinTab
      if (tabShows[idx] && !toValue(tabShows[idx]))
        return false
      if (settings.hiddenTabs.value.includes(_tab.name))
        return false
      if (settings.hiddenTabCategories.value.includes(tab.category || 'app'))
        return false
      return true
    })
    .sort((a, b) => categoryOrder.indexOf(a.category || 'app') - categoryOrder.indexOf(b.category || 'app')),
  )
}

export function useAllRoutes() {
  const router = useClientRouter()
  const serverPages = useServerPages()
  return computed((): RouteInfo[] => {
    return (router.value?.getRoutes() || [])
      .map(i => objectPick(i, ['path', 'name', 'meta', 'props', 'children']))
      .map((i) => {
        return {
          ...serverPages.value?.find(j => j.name && j.name === i.name),
          ...i,
        }
      })
  })
}
