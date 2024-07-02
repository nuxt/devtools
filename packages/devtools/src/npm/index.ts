import { createRequire } from 'node:module'
import { logger, useNuxt } from '@nuxt/kit'
import { readPackageJSON } from 'pkg-types'
import semver from 'semver'
import { getPackageInfo } from 'local-pkg'
import type { PackageUpdateInfo } from '../types'

export async function getMainPackageJSON(nuxt = useNuxt()) {
  return readPackageJSON(nuxt.options.rootDir)
}

export interface Packument {
  'name': string
  /**
   * An object where each key is a version, and each value is the manifest for
   * that version.
   */
  'versions': Record<string, Omit<Packument, 'versions'>>
  /**
   * An object mapping dist-tags to version numbers. This is how `foo@latest`
   * gets turned into `foo@1.2.3`.
   */
  'dist-tags': { latest: string } & Record<string, string>
  /**
   * In the full packument, an object mapping version numbers to publication
   * times, for the `opts.before` functionality.
   */
  'time': Record<string, string> & {
    created: string
    modified: string
  }
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
    const { version: latest } = await getLatestVersion(name)

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
