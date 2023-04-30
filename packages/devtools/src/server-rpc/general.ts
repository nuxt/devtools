import { existsSync } from 'node:fs'
import type { Component, NuxtApp, NuxtPage } from 'nuxt/schema'
import type { Import, Unimport } from 'unimport'
import { resolveBuiltinPresets } from 'unimport'
import { resolve } from 'pathe'
import { logger } from '@nuxt/kit'

import type { HookInfo, NuxtDevtoolsServerContext, ServerFunctions } from '../types'
import { setupHooksDebug } from '../runtime/shared/hooks'

export function setupGeneralRPC({ nuxt, refresh, openInEditorHooks }: NuxtDevtoolsServerContext) {
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
    getServerApp() {
      return serverApp
    },
    getComponents() {
      return components
    },
    async getComponentsRelationships() {
      return [] // replaced by vite-inspector setup
    },
    getServerPages() {
      return serverPages
    },
    getAutoImports() {
      return {
        imports: [
          ...imports,
          ...importPresets,
        ],
        metadata: unimport?.getMetadata(),
        dirs: importDirs,
      }
    },
    getServerLayouts() {
      return Object.values(app?.layouts || [])
    },
    getServerHooks() {
      return Object.values(serverHooks)
    },
    async openInEditor(input: string) {
      if (input.startsWith('./'))
        input = resolve(process.cwd(), input)

      // separate line and column syntax
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
    restartNuxt(hard = true) {
      logger.info('Restarting Nuxt...')
      return nuxt.callHook('restart', { hard })
    },
  } satisfies Partial<ServerFunctions>
}
