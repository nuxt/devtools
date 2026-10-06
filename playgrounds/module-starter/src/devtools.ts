import type { Resolver } from '@nuxt/kit'
import type { Nuxt } from 'nuxt/schema'
import { existsSync } from 'node:fs'
import { NUXT_DEVTOOLS_GROUP_ID, onDevtoolsReady } from '@nuxt/devtools-kit'

const DEVTOOLS_UI_ROUTE = '/__my-module'
const DEVTOOLS_UI_LOCAL_PORT = 3300

export function setupDevToolsUI(nuxt: Nuxt, resolver: Resolver) {
  const clientPath = resolver.resolve('./client')
  const isProductionBuild = existsSync(clientPath)

  // Serve production-built client (used when package is published)
  if (isProductionBuild) {
    nuxt.hook('vite:serverCreated', async (server) => {
      const sirv = await import('sirv').then(r => r.default || r) as typeof import('sirv').default
      server.middlewares.use(
        DEVTOOLS_UI_ROUTE,
        sirv(clientPath, { dev: true, single: true }),
      )
    })
  }
  // In local development, start a separate Nuxt Server and proxy to serve the client
  else {
    nuxt.hook('vite:extendConfig', (config) => {
      config.server = config.server || {}
      config.server.proxy = config.server.proxy || {}
      config.server.proxy[DEVTOOLS_UI_ROUTE] = {
        target: `http://localhost:${DEVTOOLS_UI_LOCAL_PORT}${DEVTOOLS_UI_ROUTE}`,
        changeOrigin: true,
        followRedirects: true,
        rewrite: path => path.replace(DEVTOOLS_UI_ROUTE, ''),
      }
    })
  }

  onDevtoolsReady((ctx) => {
    ctx.docks.register({
      // unique identifier
      id: 'my-module',
      // title to display in the dock
      title: 'My Module',
      // any icon from Iconify, or a URL to an image
      icon: 'carbon:apps',
      // iframe view
      type: 'iframe',
      url: DEVTOOLS_UI_ROUTE,
      // show it inside the `Nuxt` group, next to the built-in tabs
      groupId: NUXT_DEVTOOLS_GROUP_ID,
    })
  })
}
