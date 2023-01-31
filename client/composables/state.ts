import type { Component } from '@nuxt/schema'
import { $fetch } from 'ohmyfetch'
import type { Ref } from 'vue'
import type { ModuleBuiltinTab, ModuleMetric } from '../../src/types'
import type { HookInfo } from '~~/../dist/types'

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

  const globalComponents = $computed(() =>
    Object
      .entries(client.value?.nuxt?.vueApp._context.components || {})
      .map(([key]) => ({
        pascalName: key,
        global: true,
      } as unknown as Component))
    // dedupe server components
      .filter(i => !(serverComponents.value || []).find(j => j.pascalName === i.pascalName)),
  )

  return computed(() => [
    ...globalComponents,
    ...serverComponents.value || [],
  ].sort((a, b) => a.pascalName.localeCompare(b.pascalName)))
}

export function usePackageVersions() {
  return useAsyncState('usePackageVersions', () => rpc.usePackageVersions())
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

export function useServerConfig() {
  return useAsyncState('getServerConfig', () => rpc.getServerConfig())
}

export function useCustomTabs() {
  return useAsyncState('getCustomTabs', () => rpc.getCustomTabs())
}

export function useTabs() {
  const router = useRouter()
  const customTabs = useCustomTabs()

  const builtin = computed(() => {
    return router.getRoutes()
      .filter(route => route.path.startsWith('/modules/') && route.meta.title && !route.meta.wip)
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
