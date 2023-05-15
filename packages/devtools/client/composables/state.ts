import type { Component } from 'nuxt/schema'
import { $fetch } from 'ofetch'
import type { Ref } from 'vue'
import { objectPick } from '@antfu/utils'
import type { HookInfo, InstallModuleReturn, InstalledModuleInfo, ModuleBuiltinTab, ModuleCustomTab, ModuleStaticInfo, RouteInfo, TabCategory } from '../../src/types'

const ignoredModules = [
  'pages',
  'meta',
  'components',
  'imports',
  'nuxt-config-schema',
  '@nuxt/devtools',
  '@nuxt/telemetry',
]

export function useModulesList() {
  return useAsyncData('modules-list', async () => {
    const modules = await $fetch<ModuleStaticInfo[]>('https://cdn.jsdelivr.net/npm/@nuxt/modules@latest/modules.json')
    return modules
      .filter((m: ModuleStaticInfo) => !ignoredModules.includes(m.npm) && m.compatibility.nuxt.includes('^3'))
  }).data
}

export function useInstalledModules() {
  return useState('installed-modules', () => {
    const config = useServerConfig()
    const modules = useModulesList()

    return computed(() => (config.value?._installedModules || [])
      .map((mod): InstalledModuleInfo => {
        const isPackageModule = mod.entryPath && isNodeModulePath(mod.entryPath)
        const name = mod.meta?.name
          ? mod.meta?.name
          : mod.entryPath
            ? isPackageModule
              ? getModuleNameFromPath(mod.entryPath)
              : config.value?.rootDir
                ? parseReadablePath(mod.entryPath, config.value?.rootDir).path
                : undefined
            : undefined

        const isUninstallable = config.value?.modules?.includes(name)
        const info = modules.value?.find(m => m.npm === name)

        return {
          name,
          isPackageModule,
          isUninstallable,
          info,
          ...mod,
        }
      })
      .filter(i => !i.name || !ignoredModules.includes(i.name)),
    )
  })
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
  const settings = useDevToolsOptions()
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

  const settings = useDevToolsOptions()

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
  const settings = useDevToolsOptions()

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
