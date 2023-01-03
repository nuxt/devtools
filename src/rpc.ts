import { existsSync } from 'fs'
import type { TinyWSRequest } from 'tinyws'
import type { NodeIncomingMessage, NodeServerResponse } from 'h3'
import type { WebSocket } from 'ws'
import { createBirpcGroup } from 'birpc'
import type { ChannelOptions } from 'birpc'

import { parse, stringify } from 'flatted'
import type { Component, Nuxt, NuxtPage } from '@nuxt/schema'
import type { Import } from 'unimport'
import { resolvePreset } from 'unimport'
import type { ClientFunctions, HookInfo, ModuleCustomTab, Payload, RouteInfo, ServerFunctions } from './types'

export function setupRPC(nuxt: Nuxt) {
  const components: Component[] = []
  const imports: Import[] = []
  const importPresets: Import[] = []
  const clientRoutes: RouteInfo[] = []
  const serverPages: NuxtPage[] = []
  const customTabs: ModuleCustomTab[] = []
  const serverHooks: Record<string, HookInfo> = {}

  const payload: Payload = {
    url: '',
    time: Date.now(),
  }

  const serverFunctions: ServerFunctions = {
    getConfig() {
      return nuxt.options
    },
    getComponents() {
      return components
    },
    getPages() {
      return clientRoutes.map((i) => {
        return {
          ...serverPages.find(s => s.name && s.name === i.name),
          ...i,
        }
      })
    },
    getAutoImports() {
      return [
        ...imports,
        ...importPresets,
      ]
    },
    getPayload() {
      return payload
    },
    getCustomTabs() {
      return customTabs
    },
    getServerHooks() {
      return Object.values(serverHooks)
    },
    async openInEditor(filepath: string) {
      const file = [
        filepath,
        `${filepath}.js`,
        `${filepath}.mjs`,
        `${filepath}.ts`,
      ].find(i => existsSync(i))
      if (file) {
        // @ts-expect-error missin types
        await import('launch-editor').then(r => (r.default || r)(file))
      }
    },
  }

  const clients = new Set<WebSocket>()
  const birpc = createBirpcGroup<ClientFunctions>(serverFunctions, [])

  nuxt.hooks.beforeEach((event) => {
    serverHooks[event.name] = {
      name: event.name,
      start: performance.now(),
    }
  })
  nuxt.hooks.afterEach((event) => {
    const hook = serverHooks[event.name]
    if (!hook)
      return
    hook.end = performance.now()
    hook.duration = hook.end - hook.start
  })

  nuxt.hook('components:extend', (v) => {
    components.length = 0
    components.push(...v)
    birpc.boardcast.refresh.asEvent('components')
  })
  nuxt.hook('imports:extend', (v) => {
    imports.length = 0
    imports.push(...v)
    birpc.boardcast.refresh.asEvent('composables')
  })
  nuxt.hook('pages:extend', (v) => {
    serverPages.length = 0
    serverPages.push(...v)
  })
  nuxt.hook('imports:sources', async (v) => {
    const result = (await Promise.all(v.map(i => resolvePreset(i)))).flat()
    importPresets.length = 0
    importPresets.push(...result)
  })

  const middleware = async (req: NodeIncomingMessage & TinyWSRequest, res: NodeServerResponse) => {
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
    else if (req.method === 'POST') {
      const body = await getBodyJson(req)
      if (body.method === 'setPayload') {
        const prevUrl = payload.url
        Object.assign(payload, parse(body.data))
        if (prevUrl !== payload.url)
          birpc.boardcast.refresh.asEvent('payload')

        res.end()
      }
      else if (body.method === 'setPages') {
        clientRoutes.length = 0
        clientRoutes.push(...parse(body.data))
        birpc.boardcast.refresh.asEvent('pages')
        res.end()
      }
      else {
        res.statusCode = 400
        res.end()
      }
    }
  }

  async function initHooks() {
    await nuxt.callHook('devtools:custom-tabs', customTabs)
  }

  // Nitro
  customTabs.push({
    name: 'virtual',
    title: 'Virtual Files',
    view: {
      type: 'iframe',
      src: '/_vfs',
    },
  })

  // TODO: vscode-server
  // customTabs.push({
  //   name: 'vscode',
  //   title: 'VS Code',
  //   icon: 'logos-visual-studio-code',
  //   view: {
  //     type: 'iframe',
  //     src: 'http://localhost:8000/?folder=' + encodeURIComponent(nuxt.options.rootDir)
  //   }
  // })

  return {
    middleware,
    initHooks,
    birpc,
  }
}

function getBodyJson(req: NodeIncomingMessage) {
  return new Promise<any>((resolve, reject) => {
    let body = ''
    req.on('data', chunk => body += chunk)
    req.on('error', reject)
    req.on('end', () => {
      try {
        resolve(JSON.parse(body) || {})
      }
      catch (e) {
        reject(e)
      }
    })
  })
}
