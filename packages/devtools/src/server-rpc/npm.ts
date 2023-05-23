import fs from 'node:fs/promises'
import { startSubprocess } from '@nuxt/devtools-kit'
import isInstalledGlobally from 'is-installed-globally'
import { detectPackageManager } from 'nypm'
import { parseModule } from 'magicast'
import { addNuxtModule, getDefaultExportOptions } from 'magicast/helpers'
import { checkForUpdateOf } from '../npm'
import type { NpmCommandOptions, NpmCommandType, NuxtDevtoolsServerContext, PackageManagerName, PackageUpdateInfo, ServerFunctions } from '../types'

export function setupNpmRPC({ nuxt }: NuxtDevtoolsServerContext) {
  let detectPromise: Promise<PackageManagerName> | undefined
  const updatesPromise = new Map<string, Promise<PackageUpdateInfo | undefined>>()

  function getPackageManager() {
    detectPromise ||= detectPackageManager(nuxt.options.rootDir).then(r => r?.name || 'npm')
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

    if (command === 'uninstall')
      return [agent, agent === 'npm' ? 'uninstall' : 'remove', packageName, global ? '-g' : ''].filter(Boolean)
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
    async installNuxtModule(name: string, dry = true) {
      const commands = (await getNpmCommand('install', name, { dev: true }))!

      const filepath = nuxt.options._nuxtConfigFile
      const source = await fs.readFile(filepath, 'utf-8')
      const mod = await parseModule(source, { sourceFileName: filepath })

      addNuxtModule(mod, name)

      const generated = mod.generate().code

      const processId = `nuxt:add-module:${name}`

      if (!dry) {
        const process = startSubprocess({
          command: commands[0],
          args: commands.slice(1),
        }, {
          id: processId,
          name: `Install ${name}`,
          icon: 'carbon:intent-request-create',
          restartable: false,
        })

        const execa = process.getProcess()
        const result = await execa

        await Promise.resolve()

        const code = result.exitCode
        if (code !== 0) {
          console.error(result.stderr)
          throw new Error(`Failed to install module, process exited with ${code}`)
        }

        await fs.writeFile(filepath, generated, 'utf-8')
      }

      return {
        configOriginal: source,
        configGenerated: generated,
        commands,
        processId,
      }
    },
    async uninstallNuxtModule(name: string, dry = true) {
      const commands = (await getNpmCommand('uninstall', name))!

      const filepath = nuxt.options._nuxtConfigFile
      const source = await fs.readFile(filepath, 'utf-8')
      const mod = parseModule(source, { sourceFileName: filepath })

      // TODO: remove module from config
      // removeNuxtModule(mod, name)
      const config = getDefaultExportOptions(mod)
      config.modules ||= []
      if (config.modules.includes(name)) {
        Object.values(config.modules).forEach((value, index) => {
          if (value === name)
            config.modules.splice(index - 1, 1)
        })
      }

      const generated = mod.generate().code

      const processId = `nuxt:remove-module:${name}`

      if (!dry) {
        const process = startSubprocess({
          command: commands[0],
          args: commands.slice(1),
        }, {
          id: processId,
          name: `Uninstall ${name}`,
          icon: 'carbon:intent-request-uninstall',
          restartable: false,
        })
        const execa = process.getProcess()
        const result = await execa

        await Promise.resolve()

        const code = result.exitCode
        if (code !== 0) {
          console.error(result.stderr)
          throw new Error(`Failed to uninstall module', process exited with ${code}`)
        }

        await fs.writeFile(filepath, generated, 'utf-8')
      }

      return {
        configOriginal: source,
        configGenerated: generated,
        commands,
        processId,
      }
    },
  } satisfies Partial<ServerFunctions>
}
