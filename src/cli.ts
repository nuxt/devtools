import fs from 'fs'
import consola from 'consola'
import { execa } from 'execa'
import { readUser, writeUser } from 'rc9'
import globalDirs from 'global-dirs'
import { resolve } from 'pathe'
import { name as moduleName } from '../package.json'

const RC_PATH = '.nuxtrc'

function enable(path: string, modulePath: string, removePath?: string) {
  const rc = readUser(RC_PATH)
  let changed = false

  // remove ESM entry and switch to CJS, to be compactible with Nuxt 2
  if (removePath && rc.modules?.includes(removePath)) {
    rc.modules = rc.modules.filter((p: string) => p !== removePath)
    changed = true
  }

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

function remove(paths: string[]) {
  const rc = readUser(RC_PATH)
  rc.modules = (rc.modules || []).filter((p: string) => paths.includes(p))
  writeUser(rc, RC_PATH)
  return true
}

async function run() {
  const args = process.argv.slice(2)
  const command = args[0]
  const cwd = process.cwd()

  if (moduleName !== '@nuxt/devtools')
    throw new Error('Edge release of Nuxt Devtools requires to be installed locally. Learn more at https://github.com/nuxt/devtools/#edge-release-channel')

  const esmPath = resolve(globalDirs.npm.packages, moduleName, 'dist', 'module.mjs')
  const cjsPath = resolve(globalDirs.npm.packages, moduleName, 'module.cjs')

  if (command === 'enable') {
    consola.info('Installed Nuxt Devtools...')
    await execa('npm', ['install', '-g', `${moduleName}@latest`], { stdio: 'inherit' })

    if (!fs.existsSync(cjsPath))
      throw new Error('Failed to locate the global Nuxt Devtools module. You may try it again')

    if (enable(cwd, cjsPath, esmPath))
      consola.info('Nuxt Devtools enabled! Restart your Nuxt app to start using it.')
    else
      consola.warn('Nuxt Devtools is already enabled for this project.')
  }
  else if (command === 'disable') {
    const isRemove = args.includes('--remove')
    if (disable(cwd))
      consola.success('Nuxt Devtools disabled for this project.')
    else if (!isRemove)
      consola.warn('Nuxt Devtools is not enabled for this project.')

    if (isRemove) {
      remove([esmPath, cjsPath])
      consola.success('Nuxt Devtools is removed globally')
    }
  }
  else if (!command) {
    console.log(`npx ${moduleName} enable|disable`)
    process.exit(1)
  }
  else {
    consola.log(`Unknown command "${command}"`)
    process.exit(1)
  }
}

run()
  .catch((err) => {
    consola.error(err)
    process.exit(1)
  })
