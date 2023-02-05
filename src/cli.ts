import fs from 'fs'
import consola from 'consola'
import { execa } from 'execa'
import { readUser, writeUser } from 'rc9'
import globalDirs from 'global-dirs'
import { resolve } from 'pathe'
import { name as moduleName } from '../package.json'

const RC_PATH = '.nuxtrc'

function enable(path: string, modulePath: string) {
  const rc = readUser(RC_PATH)
  let changed = false

  if (!rc.modules?.includes(modulePath)) {
    rc.modules = [...rc.modules || [], modulePath]
    changed = true
  }

  if (!rc.devtoolsGlobal)
    rc.devtoolsGlobal = {}
  if (!rc.devtoolsGlobal.projects)
    rc.devtoolsGlobal.projects = []
  if (!rc.devtoolsGlobal.projects.includes(path)) {
    rc.devtoolsGlobal.projects.push(path)
    changed = true
  }
  if (changed)
    writeUser(rc, RC_PATH)
  return changed
}

function disable(path: string) {
  const rc = readUser(RC_PATH)
  if (rc.devtoolsGlobal?.projects?.includes(path)) {
    rc.devtoolsGlobal.projects = rc.devtoolsGlobal.projects.filter((p: string) => p !== path)
    writeUser(rc, RC_PATH)
    return true
  }
  return false
}

async function run() {
  const args = process.argv.slice(2)
  const command = args[0]
  const cwd = process.cwd()

  // TODO: Enable this check when we have a stable release
  // if (moduleName !== '@nuxt/devtools')
  //   throw new Error('Edge release of Nuxt Devtools requires to be installed locally. Learn more at https://github.com/nuxt/devtools/#edge-release-channel')

  if (command === 'enable') {
    consola.info('Installed Nuxt Devtools...')
    await execa('npm', ['install', '-g', `${moduleName}@latest`], { stdio: 'inherit' })
    const modulePath = resolve(globalDirs.npm.packages, moduleName, 'dist', 'module.mjs')

    if (!fs.existsSync(modulePath))
      throw new Error('Failed to locate the global Nuxt Devtools module. You may try it again')

    if (enable(cwd, modulePath))
      consola.info('Nuxt Devtools enabled! Restart your Nuxt app to start using it.')
    else
      consola.warn('Nuxt Devtools is already enabled for this project.')
  }
  else if (command === 'disable') {
    if (disable(cwd))
      consola.success('Nuxt Devtools disabled for this project.')
    else
      consola.warn('Nuxt Devtools is not enabled for this project.')
  }
  else {
    consola.log(`Unknown command "${command}"`)
  }
}

run()
  .catch((err) => {
    consola.error(err)
    process.exit(1)
  })
