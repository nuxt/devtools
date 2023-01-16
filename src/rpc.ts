import { existsSync } from 'fs'
import type { TinyWSRequest } from 'tinyws'
import type { NodeIncomingMessage, NodeServerResponse } from 'h3'
import type { WebSocket } from 'ws'
import { createBirpcGroup } from 'birpc'
import type { ChannelOptions } from 'birpc'

import { parse, stringify } from 'flatted'
import type { Component, Nuxt, NuxtApp, NuxtPage } from '@nuxt/schema'
import type { Import, Unimport } from 'unimport'
import { resolvePreset } from 'unimport'
import { resolve } from 'pathe'
import type { ClientFunctions, HookInfo, ModuleIframeTab, ServerFunctions } from './types'
import { setupHooksDebug } from './runtime/shared/hooks'

export function setupRPC(nuxt: Nuxt) {
  const components: Component[] = []
  const imports: Import[] = []
  const importPresets: Import[] = []
  const serverPages: NuxtPage[] = []
  const iframeTabs: ModuleIframeTab[] = []
  const customTabs: ModuleIframeTab[] = []
  const serverHooks: Record<string, HookInfo> = setupHooksDebug(nuxt.hooks)
  let unimport: Unimport | undefined
  let app: NuxtApp | undefined

  const serverFunctions: ServerFunctions = {
    getConfig() {
      return nuxt.options
    },
    getComponents() {
      return components
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
    getIframeTabs() {
      return [
        ...iframeTabs,
        ...customTabs,
      ]
    },
    getLayouts() {
      return Object.values(app?.layouts || [])
    },
    getServerHooks() {
      return Object.values(serverHooks)
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
  }

  const clients = new Set<WebSocket>()
  const birpc = createBirpcGroup<ClientFunctions>(serverFunctions, [])

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

  // @ts-expect-error missing types
  nuxt.hook('imports:context', (_unimport: Unimport) => {
    unimport = _unimport
  })

  nuxt.hook('app:resolve', (v) => {
    app = v
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
        // TODO:
      }
      else {
        res.statusCode = 400
      }
      res.end()
    }
  }

  async function initHooks() {
    customTabs.length = 0
    await nuxt.callHook('devtools:customTabs', customTabs)
  }

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
