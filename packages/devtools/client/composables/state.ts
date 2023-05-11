import type { Component } from 'nuxt/schema'
import { $fetch } from 'ofetch'
import type { Ref } from 'vue'
import { objectPick } from '@antfu/utils'
import type { HookInfo, InstallModuleReturn, ModuleBuiltinTab, ModuleCustomTab, ModuleStaticInfo, RouteInfo, TabCategory } from '../../src/types'

let modules: Promise<ModuleStaticInfo[]> | undefined
const ignores = [
  'pages',
  'meta',
  'components',
  'imports',
  'nuxt-config-schema',
  '@nuxt/devtools',
  '@nuxt/telemetry',
]

export async function useModulesInfo() {
  if (modules)
    return modules
  modules = $fetch('https://cdn.jsdelivr.net/npm/@nuxt/modules@latest/modules.json').then((res) => {
    return res.filter((m: any) => !ignores.includes(m.npm))
  })
  return modules
}

export function useModules() {
  const config = useServerConfig()
  const modules = computed(() => config.value?._installedModules || [])
  const packageModules = ref<any[]>([])
  const userModules = ref<any[]>([])

  watchEffect(() => {
    packageModules.value.length = 0
    userModules.value.length = 0
    for (const m of modules.value) {
      if (ignores.includes(m.meta?.name))
        continue
      if (m.entryPath && isNodeModulePath(m.entryPath))
        packageModules.value.push(m)
      else
        userModules.value.push(m)
    }
  })

  return {
    packageModules,
    userModules,
  }
}

type ModuleActionType = 'install' | 'uninstall'

export const ModuleDialog = createTemplatePromise<boolean, [info: ModuleStaticInfo, result: InstallModuleReturn, type: ModuleActionType]>()

export async function useModuleAction(item: ModuleStaticInfo, type: ModuleActionType) {
  const router = useRouter()
  const method = type === 'install' ? rpc.installNuxtModule : rpc.uninstallNuxtModule
  const result = await method(item.npm, true)

  if (!result.commands)
    return

  if (!await ModuleDialog.start(item, result, type))
    return

  router.push(`/modules/terminals?id=${encodeURIComponent(result.processId)}`)
  await method(item.npm, false)
}

export function useComponents() {
  const client = useClient()
  const serverComponents = useAsyncState('getComponents', () => rpc.getComponents())

  const globalComponents = computed(() =>
    Object
      .entries(client.value?.nuxt?.vueApp._context.components || {})
      .map(([key]) => ({
        pascalName: key,
        global: true,
      } as unknown as Component))
      // filter out lazy components
      .filter(i => !/^Lazy[A-Z]/.test(i.pascalName))
      // dedupe server components
      .filter(i => !(serverComponents.value || [])
        .find((s: any) => s.pascalName === i.pascalName)),
  )

  return computed(() => [
    ...globalComponents.value,
    ...serverComponents.value || [],
  ].sort((a: any, b: any) => a.pascalName.localeCompare(b.pascalName)))
}

export function useServerPages() {
  return useAsyncState('getServerPages', () => rpc.getServerPages())
}

export function useServerRoutes() {
  return useAsyncState('getServerRoutes', () => rpc.getServerRoutes())
}

export function useComponentsRelationships() {
  return useAsyncState('getComponentsRelationships', () => rpc.getComponentsRelationships())
}

export function useServerHooks() {
  return useAsyncState('getServerHooks', () => rpc.getServerHooks(), {
    default: () => [],
  }) as Ref<HookInfo[]>
}

export function useLayouts() {
  return useAsyncState('getServerLayouts', () => rpc.getServerLayouts())
}

export function useAutoImports() {
  return useAsyncState('getAutoImports', () => rpc.getAutoImports())
}

export function useStaticAssets() {
  return useAsyncState('getStaticAssets', () => rpc.getStaticAssets())
}

export function useServerConfig() {
  return useAsyncState('getServerConfig', () => rpc.getServerConfig())
}

export function useServerApp() {
  return useAsyncState('getServerApp', () => rpc.getServerApp())
}

export function useCustomTabs() {
  return useAsyncState('getCustomTabs', () => rpc.getCustomTabs())
}

export function useTerminals() {
  return useAsyncState('getTerminals', () => rpc.getTerminals())
}

export function useAllTabs() {
  const customTabs = useCustomTabs()
  const settings = useDevToolsSettings()
  const router = useRouter()
  const client = useClient()

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
    <ModuleBuiltinTab>{
      name: 'builtin-inspector',
      title: 'Inspect Vue components',
      icon: 'i-carbon-select-window',
      category: 'app',
      show() {
        return !!client.value?.inspector?.instance
      },
      onClick() {
        if (!client.value?.inspector?.instance)
          return
        client.value.inspector.enable()
        router.push('/__inspecting')
      },
    },
    ...(customTabs.value || []).filter(i => i.name.startsWith('builtin-')),
  ])

  const custom = computed(() => (customTabs.value || [])
    .filter(i => !i.name.startsWith('builtin-')))

  return computed(() => [
    ...builtin.value,
    ...custom.value,
  ])
}

export function useCategorizedTabs(enabledOnly = true) {
  const tabs = enabledOnly
    ? useEnabledTabs()
    : useAllTabs()

  const settings = useDevToolsSettings()

  return computed(() => {
    const categories: Record<TabCategory, (ModuleCustomTab | ModuleBuiltinTab)[]> = {
      app: [],
      server: [],
      analyze: [],
      modules: [],
      documentation: [],
      advanced: [],
    }

    for (const tab of tabs.value) {
      const category = (tab.category || 'app')
      if (enabledOnly && settings.hiddenTabCategories.value.includes(category))
        continue
      if (!categories[category])
        console.warn(`Unknown tab category: ${category}`)
      else
        categories[category].push(tab)
    }

    return Object.entries(categories)
  })
}

export function useEnabledTabs() {
  const tabs = useAllTabs()
  const settings = useDevToolsSettings()

  return computed(() => tabs.value.filter((tab) => {
    const _tab = tab as ModuleBuiltinTab
    if (_tab.show && !_tab.show())
      return false
    if (settings.hiddenTabs.value.includes(_tab.name))
      return false
    return true
  }))
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

interface RestartDialog {
  id: string
  message: string
}

export function useRestartDialogs() {
  return useState<RestartDialog[]>('devtools:restart-dialogs', () => [])
}

export interface VfsData {
  rootDir: string
  entries: {
    id: string
    path: string
  }[]
}

export interface VfsFile {
  id: string
  content: string
}

export function useVirtualFiles() {
  const { data } = useFetch<VfsData>('/_vfs.json', {
    key: 'vfs-list',
    baseURL: '/',
    responseType: 'json',
  })
  return data
}

export function useMergedRouteList() {
  const serverPages = useServerPages()
  const router = useClientRouter()

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
