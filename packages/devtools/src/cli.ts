import fs from 'node:fs'
import consola from 'consola'
import { execa } from 'execa'
import { readUser, writeUser } from 'rc9'
import globalDirs from 'global-dirs'
import { resolve } from 'pathe'
import { name as moduleName } from '../package.json'

type RC = ReturnType<typeof readUser>

const RC_PATH = '.nuxtrc'

function enable(rc: RC, path: string) {
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
}

function disable(rc: RC, path: string) {
  if (rc.devtoolsGlobal?.projects?.includes(path)) {
    rc.devtoolsGlobal.projects = rc.devtoolsGlobal.projects.filter((p: string) => p !== path)
    return true
  }
  // remove module if no projects
  if (!rc.devtoolsGlobal.projects?.length)
    removeModule(rc)
  return false
}

const pathRegex = /[\\\/]@nuxt[\\\/]devtools[\\\/]/

function removeModule(rc: RC) {
  if (Array.isArray(rc.modules))
    rc.modules = rc.modules.filter((p: string) => !p.match(pathRegex))
  return true
}

async function run() {
  const args = process.argv.slice(2)
  const command = args[0]
  const cwd = process.cwd()

  if (moduleName !== '@nuxt/devtools')
    throw new Error('Edge release of Nuxt Devtools requires to be installed locally. Learn more at https://github.com/nuxt/devtools/#edge-release-channel')

  const rc = readUser(RC_PATH)

  if (command === 'enable') {
    consola.info('Installed Nuxt Devtools...')
    await execa('npm', ['install', '-g', `${moduleName}@latest`], { stdio: 'inherit' })

    enable(rc, cwd)
    consola.info('Nuxt Devtools enabled! Restart your Nuxt app to start using it.')
  }
  else if (command === 'disable') {
    const isRemove = args.includes('--remove')

    if (disable(rc, cwd))
      consola.success('Nuxt Devtools disabled for this project.')
    else if (!isRemove)
      consola.warn('Nuxt Devtools is not enabled for this project.')

    if (isRemove) {
      removeModule(rc)
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

  writeUser(rc, RC_PATH)
}

run()
  .catch((err) => {
    consola.error(err)
    process.exit(1)
  })
