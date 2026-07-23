import type { CodeServerOptions } from '@devframes/plugin-code-server'
import type { CodeServerSupervisor } from '@devframes/plugin-code-server/node'
import type { CodeServerIntegrationOptions, NuxtDevtoolsServerContext } from '../types'
import { createCodeServerDevframe } from '@devframes/plugin-code-server'
import { setupCodeServer } from '@devframes/plugin-code-server/node'
import { deprecate, NUXT_DEVTOOLS_GROUP_ID, onDevtoolsReady } from '@nuxt/devtools-kit'
import { mountDevframe } from '@vitejs/devtools-kit/node'

const RESERVED_ARGS = ['--auth', '--bind-addr', '--cookie-suffix'] as const
const RESERVED_ENV = ['PASSWORD', 'HASHED_PASSWORD'] as const

function matchesOption(arg: string, option: string): boolean {
  return arg === option || arg.startsWith(`${option}=`)
}

/**
 * Validate the public escape hatches and project Nuxt's curated option surface
 * onto the upstream plugin options. The backend is pinned internally so the
 * integration cannot silently opt into Microsoft serve-web or tunnel modes.
 */
export function resolveCodeServerOptions(
  options: CodeServerIntegrationOptions | undefined,
  rootDir: string,
): CodeServerOptions {
  const args = options?.args
  const reservedArg = args?.find(arg => RESERVED_ARGS.some(option => matchesOption(arg, option)))
  if (reservedArg) {
    throw new Error(
      `[Nuxt DevTools] codeServer.args cannot override ${reservedArg.split('=')[0]}. `
      + 'Configure host and cookieSuffix through their dedicated codeServer options; authentication is managed automatically.',
    )
  }

  const env = options?.env
  const reservedEnv = RESERVED_ENV.find(key => Object.hasOwn(env ?? {}, key))
  if (reservedEnv) {
    throw new Error(
      `[Nuxt DevTools] codeServer.env cannot set ${reservedEnv}. `
      + 'Code Server authentication credentials are generated and managed automatically.',
    )
  }

  return {
    // The 0.7 plugin also knows about Microsoft's serve-web and tunnels. Nuxt
    // intentionally exposes only Coder code-server for this integration.
    backend: 'code-server',
    bin: options?.bin,
    cwd: options?.cwd ?? rootDir,
    serverPort: options?.serverPort,
    host: options?.host,
    args,
    env,
    cookieSuffix: options?.cookieSuffix,
    startTimeout: options?.startTimeout,
  }
}

/** Mount the upstream Code Server Devframe into the Nuxt dock group. */
export function setup(ctx: NuxtDevtoolsServerContext): void {
  const { nuxt, options } = ctx

  if (options.vscode !== undefined) {
    deprecate(nuxt, 'NDT_DEP_0008', {
      api: 'devtools.vscode',
      replacement: 'devtools.codeServer',
    })
  }

  if (options.codeServer?.enabled === false)
    return

  const codeServerOptions = resolveCodeServerOptions(options.codeServer, nuxt.options.rootDir)
  const definition = createCodeServerDevframe(codeServerOptions)
  let supervisor: CodeServerSupervisor | undefined
  let setupPromise: Promise<CodeServerSupervisor> | undefined

  // The upstream definition delegates only to setupCodeServer, but discards
  // its supervisor. Replace that callback so Nuxt can dispose the child process
  // during its own close lifecycle without duplicating plugin internals.
  const mountedDefinition = {
    ...definition,
    async setup(devframeCtx) {
      setupPromise = setupCodeServer(devframeCtx, codeServerOptions)
      supervisor = await setupPromise
    },
  } satisfies typeof definition

  nuxt.hook('close', async () => {
    await setupPromise
    supervisor?.dispose()
  })

  onDevtoolsReady((kit) => {
    // `mountDevframe` is re-exported from the hub package while the hook uses
    // the Vite kit's enriched context type; they are the same runtime object.
    return mountDevframe(kit as any, mountedDefinition, {
      dock: {
        groupId: NUXT_DEVTOOLS_GROUP_ID,
        category: 'framework',
        defaultOrder: -200,
      },
    })
  }, nuxt)
}
