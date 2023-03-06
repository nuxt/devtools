import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import isInstalledGlobally from 'is-installed-globally'

export const packageDir = resolve(fileURLToPath(import.meta.url), '../..')
export const distDir = resolve(fileURLToPath(import.meta.url), '..')
export const runtimeDir = resolve(distDir, 'runtime')
export const clientDir = resolve(distDir, 'client')

const globalInstallMatch = [
  '/yarn/global/',
  '/pnpm/global/',
  '/npm/global/',
  '/.nvm/',
  '/.volta/',
  '/.fnm/',
  // On Windows
  '/nvm/versions/',
  '/n/versions/',
  // TODO: More info for other package managers
]

export function isGlobalInstall() {
  if (isInstalledGlobally)
    return true
  const dir = packageDir.replace(/\\/g, '/')
  return globalInstallMatch.some(i => dir.includes(i))
}
