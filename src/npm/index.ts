import { getNuxtVersion } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import { readPackageJSON } from 'pkg-types'
import semver from 'semver'
import { version as devToolsVersion } from '../../package.json'
import type { UpdateInfo } from '../types'

export async function getMainPackageJSON(nuxt: Nuxt) {
  return readPackageJSON(nuxt.options.rootDir)
}

export async function checkForUpdateOf(info: UpdateInfo): Promise<Required<UpdateInfo>> {
  const pacote = await import('pacote')
  const manifest = await pacote.packument(info.name)

  const latest = manifest['dist-tags'].latest
  const needsUpdate = latest !== info.current && semver.lt(info.current, latest)

  return {
    ...info,
    latest,
    needsUpdate,
  }
}

export function usePackageVersions(): UpdateInfo[] {
  return [
    { name: 'nuxt', current: getNuxtVersion() },
    { name: '@nuxt/devtools-edge', current: devToolsVersion },
  ]
}

export async function checkForUpdates() {
  const versions = usePackageVersions()
  const updates = await Promise.all(versions.map(checkForUpdateOf))
  return updates
}

export async function installPackage(name: string) {
  await (await import('@antfu/install-pkg')).installPackage(name, { dev: true })
}
