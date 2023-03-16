import type { NuxtDevtoolsServerContext, ServerFunctions, UpdateInfo } from '../types'
import { checkForUpdates, getPackageVersions } from '../npm'

export function setupNpmRPC({ refresh }: NuxtDevtoolsServerContext) {
  let checkForUpdatePromise: Promise<any> | undefined
  let versions: UpdateInfo[] = getPackageVersions()

  return {
    getPackageVersions() {
      checkForUpdatePromise = checkForUpdatePromise || checkForUpdates().then((v) => {
        versions = v
        refresh('getPackageVersions')
      })
      return versions
    },
  } satisfies Partial<ServerFunctions>
}
