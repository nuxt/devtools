import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import type { TinyWSRequest } from 'tinyws'
import type { NodeIncomingMessage, NodeServerResponse } from 'h3'
import type { WebSocket } from 'ws'
import { createBirpcGroup } from 'birpc'
import type { ChannelOptions } from 'birpc'
import c from 'picocolors'
import type { Storage, StorageValue } from 'unstorage'
import type { StorageMounts } from 'nitropack'
import fg from 'fast-glob'
import { imageMeta } from 'image-meta'

import { parse, stringify } from 'flatted'
import type { Component, Nuxt, NuxtApp, NuxtPage } from 'nuxt/schema'
import type { Import, Unimport } from 'unimport'
import { resolvePreset } from 'unimport'
import { join, resolve } from 'pathe'
import { logger } from '@nuxt/kit'
import type { AssetType, ClientFunctions, HookInfo, ImageMeta, ModuleCustomTab, ServerFunctions, UpdateInfo } from './types'
import { setupHooksDebug } from './runtime/shared/hooks'
import type { ModuleOptions } from './module'
import type { WizardActions } from './wizard'
import { wizard } from './wizard'
import { LOG_PREFIX } from './logger'
import { checkForUpdates, getPackageVersions } from './npm'

const IGNORE_STORAGE_MOUNTS = ['root', 'build', 'src', 'cache']
const shouldIgnoreStorageKey = (key: string) => IGNORE_STORAGE_MOUNTS.includes(key.split(':')[0])

export function setupRPC(nuxt: Nuxt, options: ModuleOptions) {
  const components: Component[] = []
  const imports: Import[] = []
  const importPresets: Import[] = []
  const serverPages: NuxtPage[] = []
  const iframeTabs: ModuleCustomTab[] = []
  const serverHooks: Record<string, HookInfo> = setupHooksDebug(nuxt.hooks)
  const storageMounts: StorageMounts = {}

  let storage: Storage | undefined
  let unimport: Unimport | undefined
  let app: NuxtApp | undefined

  let checkForUpdatePromise: Promise<any> | undefined
  let versions: UpdateInfo[] = getPackageVersions()

  const customTabs: ModuleCustomTab[] = []
  const serverFunctions = {} as ServerFunctions
  const clients = new Set<WebSocket>()
  const birpc = createBirpcGroup<ClientFunctions>(serverFunctions, [])

  const _imageMetaCache = new Map<string, ImageMeta | undefined>()

  // Add static custom tabs from the config
  if (options.customTabs?.length)
    customTabs.push(...options.customTabs)

  function refresh(event: keyof ServerFunctions) {
    birpc.broadcast.refresh.asEvent(event)
  }

  nuxt.hook('nitro:init', (nitro) => {
    storage = nitro.storage

    nuxt.hook('ready', () => {
      storage!.watch((event, key) => {
        if (shouldIgnoreStorageKey(key))
          return
        birpc.broadcast.callHook.asEvent('storage:key:update', key, event)
      })
    })

    // Taken from https://github.com/unjs/nitro/blob/d83f2b65165d7ba996e7ef129ea99ff5b551dccc/src/storage.ts#L7-L10
    // Waiting for https://github.com/unjs/unstorage/issues/53
    const mounts = {
      ...nitro.options.storage,
      ...nitro.options.devStorage,
    }
    for (const name of Object.keys(mounts)) {
      if (shouldIgnoreStorageKey(name))
        continue
      storageMounts[name] = mounts[name]
    }
  })

  Object.assign(serverFunctions, {
    async getStorageMounts() {
      return storageMounts
    },
    async getStorageKeys(base?: string) {
      if (!storage)
        return []
      try {
        const keys = await storage.getKeys(base)

        return keys.filter(key => !shouldIgnoreStorageKey(key))
      }
      catch (err) {
        console.error(`Cloud not fetch storage keys for ${base}:`, err)
        return []
      }
    },
    async getStorageItem(key: string) {
      if (!storage)
        return null
      return await storage.getItem(key)
    },
    async setStorageItem(key: string, value: StorageValue) {
      if (!storage)
        return
      return await storage.setItem(key, value)
    },
    async removeStorageItem(key: string) {
      if (!storage)
        return
      return await storage.removeItem(key)
    },
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
    getPackageVersions() {
      checkForUpdatePromise = checkForUpdatePromise || checkForUpdates().then((v) => {
        versions = v
        refresh('getPackageVersions')
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

      // search for existing path
      const path = [
        input,
        `${input}.js`,
        `${input}.mjs`,
        `${input}.ts`,
      ].find(i => existsSync(i))
      if (path) {
        // @ts-expect-error missin types
        await import('launch-editor').then(r => (r.default || r)(path + suffix))
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
    async getStaticAssets() {
      const dir = resolve(nuxt.options.srcDir, nuxt.options.dir.public)
      const baseURL = nuxt.options.app.baseURL
      const files = await fg(['**/*'], {
        cwd: dir,
        onlyFiles: true,
      })

      function guessType(path: string): AssetType {
        if (/\.(png|jpe?g|gif|svg|webp|avif|ico|bmp|tiff?)$/i.test(path))
          return 'image'
        if (/\.(mp4|webm|ogv|mov|avi|flv|wmv|mpg|mpeg|mkv|3gp|3g2|ts|mts|m2ts|vob|ogm|ogx|rm|rmvb|asf|amv|divx|m4v|svi|viv|f4v|f4p|f4a|f4b)$/i.test(path))
          return 'video'
        if (/\.(mp3|wav|ogg|flac|aac|wma|alac|ape|ac3|dts|tta|opus|amr|aiff|au|mid|midi|ra|rm|wv|weba|dss|spx|vox|tak|dsf|dff|dsd|cda)$/i.test(path))
          return 'audio'
        if (/\.(woff2?|eot|ttf|otf|ttc|pfa|pfb|pfm|afm)/i.test(path))
          return 'font'
        if (/\.(json[5c]?|te?xt|[mc]?[jt]sx?|md[cx]?|markdown)/i.test(path))
          return 'text'
        return 'other'
      }

      return await Promise.all(files.map(async (path) => {
        const filePath = resolve(dir, path)
        const stat = await fs.lstat(filePath)
        return {
          path,
          publicPath: join(baseURL, path),
          filePath,
          type: guessType(path),
          size: stat.size,
          mtime: stat.mtimeMs,
        }
      }))
    },
    async getImageMeta(filepath: string) {
      if (_imageMetaCache.has(filepath))
        return _imageMetaCache.get(filepath)
      try {
        const meta = imageMeta(await fs.readFile(filepath)) || undefined
        _imageMetaCache.set(filepath, meta)
        return meta
      }
      catch (e) {
        _imageMetaCache.set(filepath, undefined)
        console.error(e)
        return undefined
      }
    },
    async getTextAssetContent(filepath: string, limit = 300) {
      try {
        const content = await fs.readFile(filepath, 'utf-8')
        return content.slice(0, limit)
      }
      catch (e) {
        console.error(e)
        return undefined
      }
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
    serverPages.push(...Array.from(pagesSet).sort((a, b) => a.path.localeCompare(b.path)))

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
    if (options.customTabs?.length)
      customTabs.push(...options.customTabs)
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
