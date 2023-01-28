import { $fetch } from 'ohmyfetch'
import type { ModuleBuiltinTab, ModuleCustomTab, ModuleMetric, ModuleTabInfo } from '../../src/types'

let modules: ModuleMetric[] | undefined

export async function useModulesInfo() {
  if (modules)
    return modules
  modules = await $fetch('https://cdn.jsdelivr.net/npm/@nuxt/modules@latest/modules.json')
  return modules
}

export async function getTabs() {
  const router = useRouter()
  const routes = router.getRoutes()
  const custom = (await rpc.getCustomTabs())

  const builtin = routes
    .filter(route => route.path.startsWith('/modules/') && route.meta.title && !route.meta.wip)
    .sort((a, b) => (a.meta.order || 0) - (b.meta.order || 0))
    .map((i): ModuleBuiltinTab => {
      return {
        name: i.name as string,
        path: i.path,
        ...i.meta,
      }
    })

  const builtInCustom = custom.filter(i => i.name.startsWith('builtin-'))
  const customCustom = custom.filter(i => !i.name.startsWith('builtin-'))

  return {
    custom: customCustom,
    builtin: [
      ...builtin,
      ...builtInCustom,
    ],
  }
}

export const tabsInfoCustom = ref<ModuleCustomTab[]>([])
export const tabsInfoBuiltin = ref<ModuleTabInfo[]>([])
export const tabsInfoAll = computed(() => [
  ...tabsInfoBuiltin.value,
  ...tabsInfoCustom.value,
])

export async function updateTabs() {
  const {
    custom,
    builtin,
  } = await getTabs()

  tabsInfoBuiltin.value = builtin
  tabsInfoCustom.value = custom
}

export function useEnabledTabs() {
  const client = useClient()
  const config = useServerConfig()

  return computed(() => tabsInfoAll.value.filter((tab) => {
    const _tab = tab as ModuleBuiltinTab
    if (_tab.requireClient && !client)
      return false
    if (_tab.requirePages && !config.value?.pages)
      return false
    return true
  }))
}
