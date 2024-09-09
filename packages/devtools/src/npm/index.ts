import { createRequire } from 'node:module'
import { logger, useNuxt } from '@nuxt/kit'
import { getPackageInfo } from 'local-pkg'
import { fetch } from 'ofetch'
import { readPackageJSON } from 'pkg-types'
import semver from 'semver'
import type { PackageUpdateInfo } from '../types'

export async function getMainPackageJSON(nuxt = useNuxt()) {
  return readPackageJSON(nuxt.options.rootDir)
}

export async function checkForUpdateOf(name: string, current?: string, nuxt = useNuxt()): Promise<PackageUpdateInfo | undefined> {
  try {
    if (!current) {
      const require = createRequire(nuxt.options.rootDir)
      const info = await getPackageInfo(name, { paths: require.resolve.paths(name) || undefined })
      if (!info)
        return
      current = info.packageJson.version
    }

    if (!current)
      return

    const { getLatestVersion } = await import('fast-npm-meta')
    const { version: latest } = await getLatestVersion(name, {
      fetch,
    })

    const needsUpdate = !!latest && latest !== current && semver.lt(current, latest)

    return {
      name,
      current,
      latest: latest || current,
      needsUpdate,
    }
  }
  catch (e) {
    logger.warn(`Failed to check for update of ${name}:`)
    logger.warn(e)
  }
}
