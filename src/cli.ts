import fs from 'fs'
import os from 'os'
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

  const esmPath = resolve(modulePath, 'dist', 'module.mjs')
  const cjsPath = resolve(modulePath, 'module.cjs')

  // legacy path to be removed
  const removePaths = [
    modulePath,
    esmPath,
  ]

  // in windows, we need to replace backslash with slash
  if (os.platform() === 'win32') {
    removePaths.push(
      modulePath.replace(/\\/g, '/'),
      esmPath.replace(/\\/g, '/'),
      cjsPath,
    )
  }

  const targetPath = cjsPath.replace(/\\/g, '/')

  if (!fs.existsSync(targetPath))
    throw new Error('Failed to locate the global Nuxt Devtools module. You may try it again')

  // remove ESM entry and switch to CJS, to be compactible with Nuxt 2
  if (rc.modules && Array.isArray(rc.modules)) {
    rc.modules = rc.modules.filter((i: string) => {
      const result = !removePaths.includes(i)
      if (!result)
        changed = true
      return result
    })
  }

  if (!rc.modules?.includes(targetPath)) {
    rc.modules = [...rc.modules || [], targetPath]
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

function remove(modulePath: string) {
  const rc = readUser(RC_PATH)

  const esmPath = resolve(modulePath, 'dist', 'module.mjs')
  const cjsPath = resolve(modulePath, 'module.cjs')

  const removePaths = [
    modulePath,
    esmPath,
    cjsPath,
    modulePath.replace(/\\/g, '/'),
    esmPath.replace(/\\/g, '/'),
    cjsPath.replace(/\\/g, '/'),
  ]

  rc.modules = (rc.modules || []).filter((p: string) => !removePaths.includes(p))
  writeUser(rc, RC_PATH)
  return true
}

async function run() {
  const args = process.argv.slice(2)
  const command = args[0]
  const cwd = process.cwd()

  if (moduleName !== '@nuxt/devtools')
    throw new Error('Edge release of Nuxt Devtools requires to be installed locally. Learn more at https://github.com/nuxt/devtools/#edge-release-channel')

  const modulePath = resolve(globalDirs.npm.packages, moduleName)

  if (command === 'enable') {
    consola.info('Installed Nuxt Devtools...')
    await execa('npm', ['install', '-g', `${moduleName}@latest`], { stdio: 'inherit' })

    if (enable(cwd, modulePath))
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
      remove(modulePath)
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
