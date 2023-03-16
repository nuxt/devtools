import type { Component } from 'nuxt/schema'
import { $fetch } from 'ofetch'
import type { Ref } from 'vue'
import { objectPick } from '@antfu/utils'
import type { HookInfo, ModuleBuiltinTab, ModuleMetric, RouteInfo } from '../../src/types'

let modules: ModuleMetric[] | undefined

export async function useModulesInfo() {
  if (modules)
    return modules
  modules = await $fetch('https://cdn.jsdelivr.net/npm/@nuxt/modules@latest/modules.json')
  return modules
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

export function useCustomTabs() {
  return useAsyncState('getCustomTabs', () => rpc.getCustomTabs())
}

export function useTerminals() {
  return useAsyncState('getTerminals', () => rpc.getTerminals())
}

export function useTabs() {
  const router = useRouter()
  const customTabs = useCustomTabs()
  const settings = useDevToolsSettings()

  const builtin = computed(() => {
    return router.getRoutes()
      .filter(route => route.path.startsWith('/modules/') && route.meta.title && !route.meta.wip)
      .filter(route => !route.meta.experimental || (route.meta.experimental && settings.showExperimentalFeatures.value))
      .sort((a, b) => (a.meta.order || 100) - (b.meta.order || 100))
      .map((i): ModuleBuiltinTab => {
        return {
          name: i.name as string,
          path: i.path,
          ...i.meta,
        }
      })
  })

  const builtInCustom = computed(() => (customTabs.value || []).filter(i => i.name.startsWith('builtin-')))
  const customCustom = computed(() => (customTabs.value || []).filter(i => !i.name.startsWith('builtin-')))

  return {
    custom: customCustom,
    builtin: computed(() => [
      ...builtin.value,
      ...builtInCustom.value,
    ]),
    all: computed(() => [
      ...builtin.value,
      ...builtInCustom.value,
      ...customCustom.value,
    ]),
  }
}

export function useEnabledTabs() {
  const client = useClient()
  const tabs = useTabs()

  return computed(() => tabs.all.value.filter((tab) => {
    const _tab = tab as ModuleBuiltinTab
    if (_tab.requireClient && !client.value)
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
