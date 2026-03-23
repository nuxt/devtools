import type { ModuleOptions, NuxtLayout } from '@nuxt/schema'
import type { Component, NuxtApp, NuxtPage } from 'nuxt/schema'
import type { Import, Unimport } from 'unimport'
import type { AutoImportsWithMetadata, HookInfo, NuxtDevtoolsServerContext, ServerDebugContext, ServerFunctions } from '../types'
import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import { logger } from '@nuxt/kit'
import destr from 'destr'
import { dirname, join, resolve } from 'pathe'
import { snakeCase } from 'scule'

import { resolveBuiltinPresets } from 'unimport'
import { setupHooksDebug } from '../runtime/shared/hooks'
import { toJsLiteral } from '../utils/serialize-js-literal'
import { getOptions } from './options'

const ABSOLUTE_PATH_RE = /^[a-z]:|^\//i
// eslint-disable-next-line regexp/no-super-linear-backtracking
const FILE_LINE_COL_RE = /^(.*?)(:[:\d]*)$/
const NUXT_WELCOME_RE = /<NuxtWelcome\s*\/>/

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
    serverPages.push(...[...pagesSet].toSorted((a: NuxtPage, b: NuxtPage) => a.path.localeCompare(b.path)))

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
  nuxt.hook('imports:context', (_unimport: any) => {
    unimport = _unimport as Unimport
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
    async getServerDebugContext() {
      if (!nuxt._debug)
        return

      return <ServerDebugContext>{
        ...nuxt._debug,
        moduleMutationRecords: await Promise.all(
          nuxt._debug.moduleMutationRecords?.map(async (i) => {
            let value = i.value
            try {
              const json = toJsLiteral(value)
              if (json.length > 200)
                value = `${json.slice(0, 200)}...`
              else
                value = json
            }
            catch {
              value = '[Circular]'
            }
            let name = (await i.module.getMeta?.())?.name
            if (!name) {
              const installedModule = nuxt.options._installedModules.find(m => m.module === i.module)
              name = installedModule?.meta.name || installedModule?.entryPath
            }

            return {
              ...i,
              module: undefined,
              name: name || '(unknown)',
              value,
            }
          }) || [],
        ),
      }
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
      if (input.startsWith('./') || !ABSOLUTE_PATH_RE.test(input))
        input = resolve(process.cwd(), input)

      // separate line and column syntax
      const match = input.match(FILE_LINE_COL_RE)
      let suffix = ''
      if (match) {
        input = match[1]!
        suffix = match[2]!
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
          const result = await hook(path + suffix)
          if (result)
            return true
        }
        let editor = getOptions()?.behavior.openInEditor ?? undefined
        if (editor === 'auto')
          editor = undefined
        await import('launch-editor').then(r => (r.default || r)(path + suffix, editor))
        return true
      }
      catch (e) {
        console.error(e)
        return false
      }
    },
    async enablePages(token: string) {
      await ensureDevAuthToken(token)

      const baseDir = nuxt.options.future.compatibilityVersion === 4 ? nuxt.options.dir.app : nuxt.options.srcDir
      const pathApp = join(baseDir, 'app.vue')
      const pathPageIndex = join(baseDir, 'pages/index.vue')

      if (existsSync(pathPageIndex)) {
        logger.warn('pages/index.vue already exists, skipping')
        return
      }

      const pagesIndexTemplate = `<script setup lang="ts">\nconst route = useRoute()\n</script>\n\n<template>\n  <div>\n    <h1>Nuxt Routing set up successfully!</h1>\n    <p>Current route: {{ route.path }}</p>\n    <a href="https://nuxt.com/docs/getting-started/routing" target="_blank">Learn more about Nuxt Routing</a>\n  </div>\n</template>\n`

      await fs.mkdir(dirname(pathPageIndex), { recursive: true })
      await fs.writeFile(pathPageIndex, pagesIndexTemplate, 'utf-8')

      let appContent = existsSync(pathApp)
        ? await fs.readFile(pathApp, 'utf-8')
        : undefined

      if (appContent && !appContent.includes('<NuxtPage')) {
        appContent = appContent
          .replace('</template>', '  <NuxtPage />\n</template>')
          .replace(NUXT_WELCOME_RE, '')
        await fs.writeFile(pathApp, appContent, 'utf-8')
      }

      logger.success('Routing creation completed')
    },
    async restartNuxt(token: string, hard = true) {
      await ensureDevAuthToken(token)
      logger.info('Restarting Nuxt...')
      return nuxt.callHook('restart', { hard })
    },
    /** @deprecated Auth is now handled by Vite DevTools */
    async requestForAuth() {
      logger.warn('[nuxt-devtools] `requestForAuth` is deprecated. Auth is now handled by Vite DevTools.')
    },
    /** @deprecated Auth is now handled by Vite DevTools */
    async verifyAuthToken() {
      logger.warn('[nuxt-devtools] `verifyAuthToken` is deprecated. Auth is now handled by Vite DevTools.')
      return true
    },
  } satisfies Partial<ServerFunctions>
}
