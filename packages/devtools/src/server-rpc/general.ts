import { existsSync } from 'node:fs'
import { logger } from '@nuxt/kit'
import { colors } from 'consola/utils'
import destr from 'destr'
import { resolve } from 'pathe'
import { snakeCase } from 'scule'
import { resolveBuiltinPresets } from 'unimport'
import type { ModuleOptions, NuxtLayout } from '@nuxt/schema'
import type { Component, NuxtApp, NuxtPage } from 'nuxt/schema'

import type { Import, Unimport } from 'unimport'
import { getDevAuthToken } from '../dev-auth'
import { setupHooksDebug } from '../runtime/shared/hooks'
import type { AutoImportsWithMetadata, HookInfo, NuxtDevtoolsServerContext, ServerFunctions } from '../types'

export function setupGeneralRPC({
  nuxt,
  options,
  refresh,
  ensureDevAuthToken,
  openInEditorHooks,
}: NuxtDevtoolsServerContext) {
  const components: Component[] = []
  const imports: Import[] = []
  const importPresets: Import[] = []
  let importDirs: string[] = []
  const serverPages: NuxtPage[] = []
  let serverApp: NuxtApp | undefined

  const serverHooks: Record<string, HookInfo> = setupHooksDebug(nuxt.hooks)

  let unimport: Unimport | undefined
  let app: NuxtApp | undefined

  // Nuxt Hooks to collect data
  nuxt.hook('components:extend', (v) => {
    components.length = 0
    components.push(...v)
    components.sort((a, b) => a.pascalName.localeCompare(b.pascalName))
    refresh('getComponents')
  })
  nuxt.hook('imports:extend', (v) => {
    imports.length = 0
    imports.push(...v)
    refresh('getAutoImports')
  })
  nuxt.hook('pages:extend', (v) => {
    serverPages.length = 0

    const pagesSet = new Set(v)
    function searchChildren(page: NuxtPage) {
      if (pagesSet.has(page))
        return
      pagesSet.add(page)
      page.children?.forEach(searchChildren)
    }
    v.forEach(searchChildren)
    serverPages.push(...Array.from(pagesSet).sort((a, b) => a.path.localeCompare(b.path)))

    refresh('getServerPages')
  })
  nuxt.hook('app:resolve', (app) => {
    serverApp = app
  })
  nuxt.hook('imports:sources', async (v) => {
    const result = (await resolveBuiltinPresets(v)).flat()
    importPresets.length = 0
    importPresets.push(...result)
    refresh('getAutoImports')
  })
  nuxt.hook('imports:context', (_unimport: Unimport) => {
    unimport = _unimport
  })
  nuxt.hook('imports:dirs', (dirs) => {
    importDirs = dirs
  })
  nuxt.hook('app:resolve', (v) => {
    app = v
  })

  return {
    getServerConfig() {
      return nuxt.options
    },
    getServerRuntimeConfig(): Record<string, any> {
      // Ported from https://github.com/unjs/nitro/blob/88e79fcdb2a024c96a3d1fd272d0acbff0405013/src/runtime/config.ts#L31
      // Since this operation happends on the Nitro runtime
      const ENV_PREFIX = 'NITRO_'
      const ENV_PREFIX_ALT = 'NUXT_'

      function _getEnv(key: string) {
        const envKey = snakeCase(key).toUpperCase()
        return destr(process.env[ENV_PREFIX + envKey] ?? process.env[ENV_PREFIX_ALT + envKey])
      }

      function _isObject(input: unknown) {
        return typeof input === 'object' && !Array.isArray(input)
      }

      function _applyEnv(obj: any, parentKey = '') {
        for (const key in obj) {
          const subKey = parentKey ? `${parentKey}_${key}` : key
          const envValue = _getEnv(subKey)
          if (_isObject(obj[key])) {
            if (_isObject(envValue))
              obj[key] = { ...obj[key], ...(envValue as any) }

            _applyEnv(obj[key], subKey)
          }
          else {
            obj[key] = envValue ?? obj[key]
          }
        }
        return obj
      }

      const runtime = { ...nuxt.options.runtimeConfig }
      _applyEnv(runtime)
      return runtime
    },
    getModuleOptions(): ModuleOptions {
      return options
    },
    getServerApp(): NuxtApp | undefined {
      return serverApp
    },
    getComponents(): Component[] {
      return components
    },
    async getComponentsRelationships() {
      return [] // replaced by vite-inspector setup
    },
    getServerPages(): NuxtPage[] {
      return serverPages
    },
    getAutoImports(): AutoImportsWithMetadata {
      return {
        imports: [
          ...imports,
          ...importPresets,
        ],
        metadata: unimport?.getMetadata(),
        dirs: importDirs,
      }
    },
    getServerLayouts(): NuxtLayout[] {
      return Object.values(app?.layouts || [])
    },
    getServerHooks(): HookInfo[] {
      return Object.values(serverHooks)
    },
    async openInEditor(input: string): Promise<boolean> {
      if (input.startsWith('./'))
        input = resolve(process.cwd(), input)

      // separate line and column syntax
      // eslint-disable-next-line regexp/no-super-linear-backtracking
      const match = input.match(/^(.*?)(:[:\d]*)$/)
      let suffix = ''
      if (match) {
        input = match[1]
        suffix = match[2]
      }

      // search for existing path
      const path = [
        input,
        `${input}.js`,
        `${input}.mjs`,
        `${input}.ts`,
      ].find(i => existsSync(i))

      if (!path) {
        console.error('File not found:', input)
        return false
      }

      try {
        for (const hook of openInEditorHooks) {
          const result = await hook(path)
          if (result)
            return true
        }
        // @ts-expect-error missin types
        await import('launch-editor').then(r => (r.default || r)(path + suffix))
        return true
      }
      catch (e) {
        console.error(e)
        return false
      }
    },
    async restartNuxt(token: string, hard = true) {
      await ensureDevAuthToken(token)
      logger.info('Restarting Nuxt...')
      return nuxt.callHook('restart', { hard })
    },
    async requestForAuth(info, origin?) {
      if (options.disableAuthorization)
        return

      const token = await getDevAuthToken()

      origin ||= `${nuxt.options.devServer.https ? 'https' : 'http'}://${nuxt.options.devServer.host === '::' ? 'localhost' : (nuxt.options.devServer.host || 'localhost')}:${nuxt.options.devServer.port}`

      const ROUTE_AUTH = `${nuxt.options.app.baseURL || '/'}/__nuxt_devtools__/auth`.replace(/\/+/g, '/')

      const message = [
        `A browser is requesting permissions of ${colors.bold(colors.yellow('writing files and running commands'))} from the DevTools UI.`,
        colors.bold(info || 'Unknown'),
        '',
        'Please open the following URL in the browser:',
        colors.bold(colors.green(`${origin}${ROUTE_AUTH}?token=${token}`)),
        '',
        'Or manually copy and paste the following token:',
        colors.bold(colors.cyan(token)),
      ]

      logger.box({
        message: message.join('\n'),
        title: colors.bold(colors.yellow(' Permission Request ')),
        style: {
          borderColor: 'yellow',
          borderStyle: 'rounded',
        },
      })
    },
    async verifyAuthToken(token: string) {
      if (options.disableAuthorization)
        return true
      return token === await getDevAuthToken()
    },
  } satisfies Partial<ServerFunctions>
}
