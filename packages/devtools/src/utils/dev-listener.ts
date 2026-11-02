import type { Buffer } from 'node:buffer'
import type { IncomingMessage } from 'node:http'
import type { Duplex } from 'node:stream'
import type { Nuxt } from 'nuxt/schema'
import type { Plugin } from 'vite'
import { Server as TlsServer } from 'node:tls'
import { DEVTOOLS_MOUNT_PATH } from '@vitejs/devtools-kit/constants'

type UpgradeHandler = (req: IncomingMessage, socket: Duplex, head: Buffer) => unknown

const SKIPS_DEVTOOLS_UPGRADES = Symbol.for('nuxt-devtools:skips-devtools-upgrades')

/**
 * Lets Vite DevTools serve its RPC WebSocket on Nuxt's HTTPS dev server
 * (nuxt/devtools#1152).
 *
 * Nuxt runs Vite in middleware mode, so `viteServer.httpServer` is `null` and
 * Vite DevTools opens its socket on a plain-HTTP side-car port. A page served
 * over HTTPS connects to it with `wss://`, and the TLS handshake fails. This
 * plugin hands Nuxt's listener to the client Vite server as `httpServer`, so
 * Vite DevTools binds the socket on the page's own origin and TLS.
 *
 * The listener also forwards every upgrade outside `buildAssetsDir` to
 * `nuxt.server.upgrade` (Nitro's dev server), which would take the DevTools
 * socket as well and end it under the RPC transport. The plugin makes that
 * handler skip DevTools paths.
 *
 * Plain-HTTP listeners keep the side-car, which they can reach. Nuxt 5's
 * vite-builder sets `httpServer` itself, and the plugin leaves it alone then.
 */
export function createDevListenerPlugin(nuxt: Nuxt): Plugin {
  return {
    name: 'nuxt:devtools:dev-listener',
    apply: 'serve',
    configureServer: {
      order: 'pre',
      handler(server) {
        // Nuxt 4 builds the SSR bundle with its own Vite server.
        if (server.config.build?.ssr || server.httpServer)
          return
        const listener = nuxt._devServerListener
        if (!(listener instanceof TlsServer))
          return
        server.httpServer = listener
        skipDevToolsUpgrades(nuxt.server)
      },
    },
  }
}

function skipDevToolsUpgrades(nuxtServer: { upgrade?: UpgradeHandler, [SKIPS_DEVTOOLS_UPGRADES]?: true } | undefined) {
  const upgrade = nuxtServer?.upgrade
  if (!nuxtServer || typeof upgrade !== 'function' || nuxtServer[SKIPS_DEVTOOLS_UPGRADES])
    return
  nuxtServer[SKIPS_DEVTOOLS_UPGRADES] = true
  nuxtServer.upgrade = (req, socket, head) => {
    if (req.url?.startsWith(DEVTOOLS_MOUNT_PATH))
      return
    return upgrade.call(nuxtServer, req, socket, head)
  }
}
