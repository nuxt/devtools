import type { DevToolsNodeContext } from '@vitejs/devtools-kit'
import type { Nuxt } from 'nuxt/schema'
import type { Plugin } from 'vite'

const MULTIPLE_SLASHES_RE = /\/+/g
const NUXT_DOCK_ICON = 'https://nuxt.com/assets/design-kit/icon-green.svg'
export const NUXT_DOCK_ID = 'nuxt:devtools'

export interface ViteDevToolsBridgeState {
  dockUrl: string
  context?: DevToolsNodeContext
}

export interface ViteDevToolsBridge {
  plugins: Plugin[]
  state: ViteDevToolsBridgeState
}

export function resolveNuxtDevToolsBaseRoute(baseURL: string | undefined) {
  return `${baseURL || '/'}/__nuxt_devtools__`.replace(MULTIPLE_SLASHES_RE, '/')
}

export function resolveNuxtDevToolsClientRoute(baseURL: string | undefined) {
  return `${resolveNuxtDevToolsBaseRoute(baseURL)}/client/`.replace(MULTIPLE_SLASHES_RE, '/')
}

export async function loadViteDevToolsPlugins(
  importer: () => Promise<{ DevTools: () => Promise<Plugin[]> }> = () => import('@vitejs/devtools'),
) {
  const { DevTools } = await importer()
  return await DevTools()
}

export async function setupViteDevToolsBridge(
  nuxt: Nuxt,
): Promise<ViteDevToolsBridge> {
  const plugins = await loadViteDevToolsPlugins()
  const dockUrl = resolveNuxtDevToolsClientRoute(nuxt.options.app.baseURL)
  const state: ViteDevToolsBridgeState = { dockUrl }

  plugins.push({
    name: 'nuxt:devtools:vite-kit-bridge',
    devtools: {
      setup(ctx) {
        state.context = ctx
        ctx.docks.register({
          id: NUXT_DOCK_ID,
          type: 'iframe',
          icon: NUXT_DOCK_ICON,
          title: 'Nuxt DevTools',
          url: dockUrl,
        })
      },
    },
  })

  return {
    plugins,
    state,
  }
}
