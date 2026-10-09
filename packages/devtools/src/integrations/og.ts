import type { NuxtDevtoolsServerContext } from '../types'
import { createOgDevframe } from '@devframes/plugin-og'
import { NUXT_DEVTOOLS_GROUP_ID, onDevtoolsReady } from '@nuxt/devtools-kit'

/**
 * Mount the Open Graph Viewer Devframe into the Nuxt dock group. It replaces
 * the removed built-in Open Graph tab.
 */
export function setup({ nuxt }: NuxtDevtoolsServerContext): void {
  const defaultUrl = nuxt.options.devServer?.url
  // The configured URL is a guess made before the server binds (`--port`, port
  // fallback), so redirect requests for it to the origin Nuxt is really serving.
  let liveOrigin: string | undefined
  nuxt.hook('listen', (_server, listener) => {
    if (listener?.url)
      liveOrigin = new URL(listener.url).origin
  })

  const definition = createOgDevframe({
    defaultUrl,
    fetch: (input, init) => {
      if (liveOrigin && defaultUrl) {
        const configured = new URL(defaultUrl).origin
        if (input.startsWith(configured))
          input = liveOrigin + input.slice(configured.length)
      }
      return fetch(input, init)
    },
  })
  onDevtoolsReady((kit) => {
    return kit.install(definition, {
      dock: {
        groupId: NUXT_DEVTOOLS_GROUP_ID,
        category: 'analyze',
      },
    })
  }, nuxt)
}
