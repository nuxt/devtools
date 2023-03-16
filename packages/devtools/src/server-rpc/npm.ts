import { detectPackageManager } from 'nypm'
import { checkForUpdateOf } from '../npm'
import type { NuxtDevtoolsServerContext, PackageManagerName, PackageUpdateInfo, ServerFunctions } from '../types'

export function setupNpmRPC({ nuxt }: NuxtDevtoolsServerContext) {
  let detectPromise: Promise<PackageManagerName> | undefined
  const updatesPromise = new Map<string, Promise<PackageUpdateInfo | undefined>>()

  return {
    checkForUpdateFor(name: string) {
      if (!updatesPromise.has(name))
        updatesPromise.set(name, checkForUpdateOf(name, undefined, nuxt))
      return updatesPromise.get(name)!
    },
    getPackageManager() {
      detectPromise ||= detectPackageManager(nuxt.options.rootDir).then(r => r.name)
      return detectPromise
    },
  } satisfies Partial<ServerFunctions>
}
