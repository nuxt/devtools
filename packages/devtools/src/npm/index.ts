import { createRequire } from 'node:module'
import { useNuxt } from '@nuxt/kit'
import { readPackageJSON } from 'pkg-types'
import semver from 'semver'
import { getPackageInfo } from 'local-pkg'
import type { PackageUpdateInfo } from '../types'

export async function getMainPackageJSON(nuxt = useNuxt()) {
  return readPackageJSON(nuxt.options.rootDir)
}

export async function checkForUpdateOf(name: string, current?: string, nuxt = useNuxt()): Promise<PackageUpdateInfo | undefined> {
  if (!current) {
    const require = createRequire(nuxt.options.rootDir)
    const info = await getPackageInfo(name, { paths: require.resolve.paths(name) || undefined })
    if (!info)
      return
    current = info.packageJson.version
  }

  const packument = await import('pacote').then(r => r.default?.packument || r.packument)
  const manifest = await packument(name)

  const latest = manifest['dist-tags'].latest
  const needsUpdate = latest !== current && semver.lt(current, latest)

  return {
    name,
    current,
    latest,
    needsUpdate,
  }
}
