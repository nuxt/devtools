import type { ServerFunctions, UpdateInfo } from '../types'
import { checkForUpdates, getPackageVersions } from '../npm'
import type { RPCContext } from './types'

export function setupNpmRPC({ refresh }: RPCContext) {
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
