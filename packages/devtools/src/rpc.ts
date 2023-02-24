import { existsSync } from 'fs'
import type { TinyWSRequest } from 'tinyws'
import type { NodeIncomingMessage, NodeServerResponse } from 'h3'
import type { WebSocket } from 'ws'
import { createBirpcGroup } from 'birpc'
import type { ChannelOptions } from 'birpc'
import c from 'picocolors'

import { parse, stringify } from 'flatted'
import type { Component, Nuxt, NuxtApp, NuxtPage } from 'nuxt/schema'
import type { Import, Unimport } from 'unimport'
import { resolvePreset } from 'unimport'
import { resolve } from 'pathe'
import { logger } from '@nuxt/kit'
import type { ClientFunctions, HookInfo, ModuleCustomTab, ServerFunctions, UpdateInfo } from './types'
import { setupHooksDebug } from './runtime/shared/hooks'
import type { ModuleOptions } from './module'
import type { WizardActions } from './wizard'
import { wizard } from './wizard'
import { LOG_PREFIX } from './logger'
import { checkForUpdates, usePackageVersions } from './npm'

export function setupRPC(nuxt: Nuxt, _options: ModuleOptions) {
  const components: Component[] = []
  const imports: Import[] = []
  const importPresets: Import[] = []
  const serverPages: NuxtPage[] = []
  const iframeTabs: ModuleCustomTab[] = []
  const customTabs: ModuleCustomTab[] = []
  const serverHooks: Record<string, HookInfo> = setupHooksDebug(nuxt.hooks)
  let unimport: Unimport | undefined
  let app: NuxtApp | undefined

  let checkForUpdatePromise: Promise<any> | undefined
  let versions: UpdateInfo[] = usePackageVersions()

  const serverFunctions = {} as ServerFunctions
  const clients = new Set<WebSocket>()
  const birpc = createBirpcGroup<ClientFunctions>(serverFunctions, [])

  function refresh(event: keyof ServerFunctions) {
    birpc.broadcast.refresh.asEvent(event)
  }

  Object.assign(serverFunctions, {
    getServerConfig() {
      return nuxt.options
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
      }
    },
    getCustomTabs() {
      return [
        ...iframeTabs,
        ...customTabs,
      ]
    },
    getServerLayouts() {
      return Object.values(app?.layouts || [])
    },
    getServerHooks() {
      return Object.values(serverHooks)
    },
    usePackageVersions() {
      checkForUpdatePromise = checkForUpdatePromise || checkForUpdates().then((v) => {
        versions = v
        refresh('usePackageVersions')
      })
      return versions
    },
    runWizard(name: WizardActions, ...args: any[]) {
      logger.info(LOG_PREFIX, `Running wizard ${c.green(name)}...`)
      return wizard[name](nuxt, ...args as [])
    },
    async openInEditor(input: string) {
      if (input.startsWith('./'))
        input = resolve(process.cwd(), input)

      // separate line and column syntax
      const match = input.match(/^(.*?)([:\d]*)$/)
      let suffix = ''
      if (match) {
        input = match[1]
        suffix = match[2]
      }

      // search for existing file
      const file = [
        input,
        `${input}.js`,
        `${input}.mjs`,
        `${input}.ts`,
      ].find(i => existsSync(i))
      if (file) {
        // @ts-expect-error missin types
        await import('launch-editor').then(r => (r.default || r)(file + suffix))
      }
      else {
        console.error('File not found:', input)
      }
    },
    async customTabAction(name, actionIndex) {
      const tab = customTabs.find(i => i.name === name)
      if (!tab)
        return false
      const view = tab.view
      if (view.type !== 'launch')
        return false
      const action = view.actions?.[actionIndex]
      if (!action)
        return false

      Promise.resolve(action.handle?.())
        .catch((e) => {
          console.error(e)
        })
        .finally(() => {
          nuxt.callHook('devtools:customTabs:refresh')
        })
      nuxt.callHook('devtools:customTabs:refresh')
      return true
    },

  } satisfies ServerFunctions)

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
    serverPages.push(...Array.from(pagesSet).sort((a, b) => a.file.localeCompare(b.file)))

    refresh('getServerPages')
  })
  nuxt.hook('imports:sources', async (v) => {
    const result = (await Promise.all(v.map(i => resolvePreset(i)))).flat()
    importPresets.length = 0
    importPresets.push(...result)
    refresh('getAutoImports')
  })
  nuxt.hook('imports:context', (_unimport: Unimport) => {
    unimport = _unimport
  })
  nuxt.hook('app:resolve', (v) => {
    app = v
  })

  const middleware = async (req: NodeIncomingMessage & TinyWSRequest, _res: NodeServerResponse) => {
    // Handle WebSocket
    if (req.ws) {
      const ws = await req.ws()
      clients.add(ws)
      const channel: ChannelOptions = {
        post: d => ws.send(d),
        on: fn => ws.on('message', fn),
        serialize: stringify,
        deserialize: parse,
      }
      birpc.updateChannels((c) => {
        c.push(channel)
      })
      ws.on('close', () => {
        clients.delete(ws)
        birpc.updateChannels((c) => {
          const index = c.indexOf(channel)
          if (index >= 0)
            c.splice(index, 1)
        })
      })
    }
  }

  async function initHooks() {
    nuxt.hook('devtools:customTabs:refresh', initCustomTabs)
    await initCustomTabs()
  }

  async function initCustomTabs() {
    customTabs.length = 0
    await nuxt.callHook('devtools:customTabs', customTabs)
    refresh('getCustomTabs')
  }

  return {
    serverFunctions,
    middleware,
    initHooks,
    birpc,
  }
}
