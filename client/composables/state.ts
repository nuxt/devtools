import { $fetch } from 'ohmyfetch'
import type { ModuleInfo } from '../../src/types'

let modules: ModuleInfo[] | undefined

export async function useModulesInfo() {
  if (modules)
    return modules
  modules = await $fetch('https://cdn.jsdelivr.net/npm/@nuxt/modules@latest/modules.json')
  return modules
}

export async function getTabs() {
  const router = useRouter()
  const routes = router.getRoutes()
const custom = (await rpc.getCustomTabs()).map(i=>{
  return {
  ...i,
  path: '/modules/custom?name=' + i.name,
  }
})
const builtin = routes
  .filter(route => route.path.startsWith('/modules/') && route.name !== 'modules-custom')
  .sort((a, b) => (a.meta.order || 0) - (b.meta.order || 0))
  .map(i=>{
    return {
      name: i.name,
      path: i.path,
      icon: i.meta.icon,
      title: i.meta.title,
    }
  })

  console.log(builtin, custom)

return [
  ...builtin,
  ...custom,
]
}
