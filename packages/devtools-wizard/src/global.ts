/**
 * This module is for installing Nuxt Devtools globally and enabling it for a project.
 *
 * Since Nuxt v3.4, Nuxt Devtools is shipped with Nuxt so we only using this for Nuxt below v3.4.
 */
import fs from 'node:fs'
import { readUser, writeUser } from 'rc9'
import globalDirs from 'global-dirs'
import { resolve } from 'pathe'
import { consola } from 'consola'
import { execa } from 'execa'

const moduleName = '@nuxt/devtools'

type RC = ReturnType<typeof readUser>
export const RC_PATH = '.nuxtrc'
const pathRegex = /[\\\/]@nuxt[\\\/]devtools[\\\/]/

export async function enable(cwd: string) {
  const rc = readUser(RC_PATH)
  consola.info('Installed Nuxt Devtools...')
  await execa('npm', ['install', '-g', `${moduleName}@latest`], { stdio: 'inherit' })

  markEnable(rc, cwd)
  consola.info('Nuxt Devtools enabled! Restart your Nuxt app to start using it.')
}

function markEnable(rc: RC, path: string) {
  const modulePath = resolve(globalDirs.npm.packages, moduleName)
  const targetPath = resolve(modulePath, 'module.cjs').replace(/\\/g, '/')

  if (!fs.existsSync(targetPath))
    throw new Error('Failed to locate the global Nuxt Devtools module. You may try it again')

  // remove all entries
  removeModule(rc)

  if (!rc.modules?.includes(targetPath))
    rc.modules = [...rc.modules || [], targetPath]

  if (!rc.devtoolsGlobal)
    rc.devtoolsGlobal = {}
  if (!rc.devtoolsGlobal.projects)
    rc.devtoolsGlobal.projects = []
  if (!rc.devtoolsGlobal.projects.includes(path))
    rc.devtoolsGlobal.projects.push(path)

  writeUser(rc, RC_PATH)
}

export function disableSilently(cwd: string) {
  const rc = readUser(RC_PATH)
  if (markDisable(rc, cwd))
    writeUser(rc, RC_PATH)
}

export async function disable(cwd: string, args: string[]) {
  const rc = readUser(RC_PATH)
  const isRemove = args.includes('--remove')

  if (markDisable(rc, cwd))
    consola.success('Nuxt Devtools disabled for this project.')
  else if (!isRemove)
    consola.warn('Nuxt Devtools is not enabled for this project.')

  if (isRemove) {
    removeModule(rc)
    consola.success('Nuxt Devtools is removed globally')
  }

  writeUser(rc, RC_PATH)
}

function markDisable(rc: RC, path: string) {
  if (rc?.devtoolsGlobal?.projects?.includes(path)) {
    rc.devtoolsGlobal.projects = rc.devtoolsGlobal.projects.filter((p: string) => p !== path)
    return true
  }
  // remove module if no projects
  if (!rc?.devtoolsGlobal?.projects?.length)
    removeModule(rc)
  return false
}

export function removeModule(rc: RC) {
  if (Array.isArray(rc.modules))
    rc.modules = rc.modules.filter((p: string) => !p.match(pathRegex))
  return true
}
