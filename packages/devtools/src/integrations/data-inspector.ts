import type { Nitro } from 'nitropack'
import type { Nuxt } from 'nuxt/schema'
import type { ResolvedConfig, ViteDevServer } from 'vite'
import type { NuxtDevtoolsServerContext, NuxtServerData } from '../types'
import { createDataInspectorDevframe, registerDataSource } from '@devframes/plugin-data-inspector'
import { deprecate, NUXT_DEVTOOLS_GROUP_ID, onDevtoolsReady } from '@nuxt/devtools-kit'
import { mountDevframe } from '@vitejs/devtools-kit/node'

/**
 * Live capture of the Nuxt server-side configuration surfaced by the Data
 * Inspector's `nuxt:application` source (and by the deprecated `getServerData`
 * RPC shim below).
 *
 * This state is module-scoped on purpose: Devframe's data-source registry is
 * process-global and not host-scoped, so this integration supports exactly one
 * active Nuxt DevTools instance per Node process, keyed by the fixed
 * `nuxt:application` source id. Running two live Nuxt DevTools hosts in one
 * process is unsupported.
 */
interface CapturedServerData {
  nitro?: Nitro
  vite?: ViteDevServer
}

const captured: CapturedServerData = {}

/**
 * Strip the live Vite instance and other non-serializable branches so the
 * config survives the RPC transport used by the deprecated `getServerData`
 * shim. Preserved verbatim from the removed `server-rpc/server-data.ts` to keep
 * the shim's payload byte-for-byte compatible for its migration window.
 *
 * The live Data Inspector source does **not** use this — it hands the raw
 * objects to the Data Inspector engine, which owns normalization, circular
 * references, and depth limits.
 */
function normalizeViteConfig(config: ResolvedConfig): ResolvedConfig {
  return {
    ...config,
    environments: Object.fromEntries(
      Object.entries(config.env ?? {}).map(([key, _]) => {
        return [key, null]
      }),
    ),
    plugins: (config.plugins ?? []).map((i) => {
      const clone = { ...i }
      delete clone.api
      return clone
    }),
    inlineConfig: null,
  } as any as ResolvedConfig
}

/**
 * Register the live `Nuxt Application` Data Inspector source, capture the raw
 * Nitro/Vite configuration as the Nuxt hooks fire, and mount the Data Inspector
 * Devframe into the Nuxt dock group.
 *
 * Always mounted when Nuxt DevTools is enabled; there is no module option.
 * Ecosystem modules that want more sources install
 * `@devframes/plugin-data-inspector` themselves and use its native
 * `registerDataSource`.
 */
export function setup(ctx: NuxtDevtoolsServerContext): void {
  const { nuxt } = ctx

  // Capture raw Nitro options once Nitro is created.
  nuxt.hook('nitro:build:before', (nitro) => {
    captured.nitro = nitro
  })

  // Capture the live Vite dev server instance. Nuxt 5 unified the former client
  // and SSR Vite servers into a single dev server, so there is exactly one
  // instance to capture. The server carries far more than the resolved config
  // (which lives at `server.config`): its runtime `environments` (client/ssr),
  // module graph, plugin containers, watcher, and websocket. The Data Inspector
  // engine handles the deep/circular/function-valued branches.
  nuxt.hook('vite:serverCreated', (server) => {
    captured.vite = server as unknown as ViteDevServer
  })

  // Register the single live source early with a non-static factory, so Nuxt
  // options are immediately queryable and the Nitro/Vite fields populate as the
  // hooks above run. The registry is process-global and shared with the mounted
  // definition, so no context threading is required.
  const unregister = registerDataSource({
    id: 'nuxt:application',
    title: 'Nuxt Application',
    description: 'Live Nuxt, Nitro, and Vite configuration',
    icon: 'i-ph:database-duotone',
    static: false,
    data: () => ({
      nuxt: nuxt.options,
      nitro: captured.nitro?.options,
      vite: captured.vite,
    }),
    queries: [
      { title: 'Overview', query: '', excludeFunctions: true },
      { title: 'Nuxt modules', query: 'nuxt.modules', excludeFunctions: true },
      { title: 'Vite plugins', query: 'vite.config.plugins', excludeFunctions: true },
      { title: 'Vite config', query: 'vite.config', excludeFunctions: true },
      { title: 'Vite environments', query: 'vite.environments', excludeFunctions: true },
      { title: 'Nitro routes', query: 'nitro.handlers', excludeFunctions: true },
    ],
  })

  // Avoid leaking a process-global source (e.g. across test fixtures).
  nuxt.hook('close', () => {
    unregister()
    captured.nitro = undefined
    captured.vite = undefined
  })

  // Mount the Data Inspector's bundled SPA as a member of the Nuxt group. The
  // definition defaults to the `~builtin` category, so the category must be
  // overridden per-mount: group members do not inherit their group's category.
  const definition = createDataInspectorDevframe({ exampleSource: false })
  onDevtoolsReady((kit) => {
    // `mountDevframe` is re-exported from the hub package while the hook uses
    // the Vite kit's enriched context type; they are the same runtime object.
    return mountDevframe(kit as any, definition, {
      dock: {
        groupId: NUXT_DEVTOOLS_GROUP_ID,
        category: 'advanced',
      },
    })
  }, nuxt)
}

/**
 * @deprecated The read-only Nuxt Options Viewer has been replaced by the Data
 * Inspector panel's live `Nuxt Application` source. This RPC is kept as a
 * compatibility shim for one migration window and emits `NDT_DEP_0009` on first
 * use; it will be removed in a future major.
 *
 * Unlike the live source, this returns the legacy `NuxtServerData` shape
 * (`vite: { server, client }`) with the resolved Vite config normalized for RPC
 * transport. Nuxt 5 unified the former client and SSR Vite servers into a
 * single dev server instance, but the legacy shape predates that; this shim
 * keeps the old contract alive independently by reading the one dev server's
 * resolved config (`server.config`) and projecting it onto both `server` and
 * `client` (each normalized separately, so consumers that mutate one field
 * don't affect the other).
 */
export function getServerData(nuxt: Nuxt): NuxtServerData {
  deprecate(nuxt, 'NDT_DEP_0009', {
    api: 'getServerData()',
    replacement: 'the Nuxt Application source in the Data Inspector panel',
  })
  const config = captured.vite?.config
  return {
    nuxt: nuxt.options,
    nitro: captured.nitro?.options,
    vite: {
      server: config ? normalizeViteConfig(config) : undefined,
      client: config ? normalizeViteConfig(config) : undefined,
    },
    // `nuxt.options` is `@nuxt/schema`'s `NuxtOptions` while `NuxtServerData`
    // pins the structurally-identical `nuxt/schema` one; bridge the two.
  } as NuxtServerData
}

/**
 * @internal
 */
export function resetCapturedServerData(): void {
  captured.nitro = undefined
  captured.vite = undefined
}
