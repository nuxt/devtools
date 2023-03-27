import { startSubprocess } from '@nuxt/devtools-kit'
import isInstalledGlobally from 'is-installed-globally'
import { detectPackageManager } from 'nypm'
import { checkForUpdateOf } from '../npm'
import type { NpmCommandOptions, NpmCommandType, NuxtDevtoolsServerContext, PackageManagerName, PackageUpdateInfo, ServerFunctions } from '../types'

export function setupNpmRPC({ nuxt }: NuxtDevtoolsServerContext) {
  let detectPromise: Promise<PackageManagerName> | undefined
  const updatesPromise = new Map<string, Promise<PackageUpdateInfo | undefined>>()

  function getPackageManager() {
    detectPromise ||= detectPackageManager(nuxt.options.rootDir).then(r => r.name)
    return detectPromise
  }

  async function getNpmCommand(command: NpmCommandType, packageName: string, options: NpmCommandOptions = {}) {
    const {
      dev = true,
      global = (packageName === '@nuxt/devtools' && isInstalledGlobally),
    } = options
    const agent = await getPackageManager()

    // TODO: smartly detect dev/global installs as default
    if (command === 'install' || command === 'update')
      return [agent, agent === 'npm' ? 'install' : 'add', `${packageName}@latest`, dev ? '-D' : '', global ? '-g' : '', '--ignore-scripts'].filter(Boolean)
  }

  async function runNpmCommand(command: NpmCommandType, packageName: string, options: NpmCommandOptions = {}) {
    const args = await getNpmCommand(command, packageName, options)

    if (!args)
      return

    const processId = `npm:${command}:${packageName}`

    startSubprocess({
      command: args[0],
      args: args.slice(1),
    }, {
      id: processId,
      name: `${command} ${packageName}`,
      icon: 'i-mdi-npm-variant-outline text-rose',
      restartable: false,
    })

    return {
      processId,
    }
  }

  return {
    checkForUpdateFor(name: string) {
      if (!updatesPromise.has(name))
        updatesPromise.set(name, checkForUpdateOf(name, undefined, nuxt))
      return updatesPromise.get(name)!
    },
    getPackageManager,
    getNpmCommand,
    runNpmCommand,
  } satisfies Partial<ServerFunctions>
}
