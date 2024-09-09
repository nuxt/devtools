import fs from 'node:fs/promises'
import { startSubprocess } from '@nuxt/devtools-kit'
import isInstalledGlobally from 'is-installed-globally'
import { parseModule } from 'magicast'
import { addNuxtModule, getDefaultExportOptions } from 'magicast/helpers'
import { detectPackageManager } from 'nypm'
import type { PackageManager } from 'nypm'
import { checkForUpdateOf } from '../npm'
import { magicastGuard } from '../utils/magicast'
import type { NpmCommandOptions, NpmCommandType, NuxtDevtoolsServerContext, PackageUpdateInfo, ServerFunctions } from '../types'

export function setupNpmRPC({ nuxt, ensureDevAuthToken }: NuxtDevtoolsServerContext) {
  let detectPromise: Promise<PackageManager | undefined> | undefined
  const updatesPromise = new Map<string, Promise<PackageUpdateInfo | undefined>>()

  function getPackageManager() {
    detectPromise ||= detectPackageManager(nuxt.options.rootDir)
    return detectPromise
  }

  async function getNpmCommand(command: NpmCommandType, packageName: string, options: NpmCommandOptions = {}) {
    const {
      dev = true,
      global = (packageName === '@nuxt/devtools' && isInstalledGlobally),
    } = options
    const agent = await getPackageManager()

    const name = agent?.name || 'npm'

    // TODO: smartly detect dev/global installs as default
    if (command === 'install' || command === 'update') {
      return [
        name,
        name === 'npm' ? 'install' : 'add',
        `${packageName}@latest`,
        dev ? '-D' : '',
        global ? '-g' : '',
        // In yarn berry, `--ignore-scripts` is removed
        (name === 'yarn' && !agent?.version?.startsWith('1.')) ? '' : '--ignore-scripts',
      ].filter(Boolean)
    }

    if (command === 'uninstall') {
      return [
        name,
        name === 'npm' ? 'uninstall' : 'remove',
        packageName,
        global ? '-g' : '',
      ].filter(Boolean)
    }
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
      icon: 'i-logos-npm-icon',
      restartable: false,
    })

    return {
      processId,
    }
  }

  const installSet: Set<string> = new Set()
  let latestGenerated: string | null = null

  return {
    checkForUpdateFor(name: string) {
      if (!updatesPromise.has(name))
        updatesPromise.set(name, checkForUpdateOf(name, undefined, nuxt))
      return updatesPromise.get(name)!
    },
    getNpmCommand,
    async runNpmCommand(token, ...args) {
      await ensureDevAuthToken(token)
      return runNpmCommand(...args)
    },
    async installNuxtModule(token: string, name: string, dry = true) {
      await ensureDevAuthToken(token)

      const commands = (await getNpmCommand('install', name, { dev: true }))!

      const filepath = nuxt.options._nuxtConfigFile

      // use the latest generated config if available
      let source = latestGenerated
      if (source == null)
        source = await fs.readFile(filepath, 'utf-8')

      const generated = await magicastGuard(async () => {
        const mod = parseModule(source!, { sourceFileName: filepath })
        addNuxtModule(mod, name)

        return mod.generate().code
      })
      const processId = `nuxt:add-module:${name}`

      if (!dry) {
        latestGenerated = generated // cache the latest generated config
        installSet.add(name)

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

        // remove module from install set
        installSet.delete(name)

        const code = result.exitCode
        if (code !== 0) {
          console.error(result.stderr)
          throw new Error(`Failed to install module, process exited with ${code}`)
        }

        // If all modules have been installed, write back to the config file, and auto restart.
        if (installSet.size === 0) {
          latestGenerated = null
          await fs.writeFile(filepath, generated, 'utf-8')
        }
      }

      return {
        configOriginal: source,
        configGenerated: generated,
        commands,
        processId,
      }
    },
    async uninstallNuxtModule(token: string, name: string, dry = true) {
      await ensureDevAuthToken(token)

      const commands = (await getNpmCommand('uninstall', name))!

      const filepath = nuxt.options._nuxtConfigFile
      const source = await fs.readFile(filepath, 'utf-8')
      const generated = await magicastGuard(async () => {
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

        return mod.generate().code
      })

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
