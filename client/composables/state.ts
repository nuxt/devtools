import { $fetch } from 'ohmyfetch'
import type { ModuleInfo } from '../../src/types'

let modules: ModuleInfo[] | undefined

export async function useModulesInfo() {
  if (modules)
    return modules
  modules = await $fetch('https://cdn.jsdelivr.net/npm/@nuxt/modules@latest/modules.json')
  return modules
}
