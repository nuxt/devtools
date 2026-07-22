import type { ViteDevToolsNodeContext } from '@vitejs/devtools-kit'
import type { BirpcGroup } from 'birpc'
import type { ChildProcess } from 'node:child_process'
import type { Result } from 'tinyexec'
import type { ModuleCustomTab, NuxtDevtoolsInfo, NuxtDevtoolsServerContext, SubprocessOptions, TerminalState } from './types'
import { useNuxt } from '@nuxt/kit'
import { x } from 'tinyexec'
import { deprecate } from './diagnostics'

export * from './diagnostics'

/**
 * The public `Nuxt` dock group id registered on the Vite DevTools framework
 * category. Module authors join the group natively by pointing their own
 * dock entries at it — no special Nuxt API required:
 *
 * @example
 * ```ts
 * import { NUXT_DEVTOOLS_GROUP_ID, onDevtoolsReady } from '@nuxt/devtools-kit'
 *
 * onDevtoolsReady((ctx) => {
 *   ctx.docks.register({
 *     id: 'my-module',
 *     type: 'iframe',
 *     title: 'My Module',
 *     icon: 'i-ph-puzzle-piece',
 *     url: '/my-module/',
 *     groupId: NUXT_DEVTOOLS_GROUP_ID,
 *   })
 * })
 * ```
 */
export const NUXT_DEVTOOLS_GROUP_ID = 'nuxt'

/**
 * Hooks to extend a custom tab in devtools.
 *
 * Provide a function to pass a factory that can be updated dynamically.
 *
 * @deprecated Register a dock entry from the `devtools:ready` hook instead:
 * `onDevtoolsReady((ctx) => ctx.docks.register(...))`. Still works as a shim, but
 * emits the `NDT_DEP_0005` deprecation diagnostic. Note the docks host does not
 * yet cover `vnode` views or tab categories.
 */
export function addCustomTab(tab: ModuleCustomTab | (() => ModuleCustomTab | Promise<ModuleCustomTab>), nuxt = useNuxt()) {
  deprecate(nuxt, 'NDT_DEP_0005', {
    api: 'addCustomTab',
    replacement: 'onDevtoolsReady((ctx) => ctx.docks.register(...))',
  }, { key: typeof tab === 'function' ? undefined : tab.name })

  nuxt.hook('devtools:customTabs', async (tabs) => {
    if (typeof tab === 'function')
      tab = await tab()
    tabs.push(tab)
  })
}

/**
 * Retrigger update for custom tabs, `devtools:customTabs` will be called again.
 *
 * @deprecated Update dock entries directly via the handle returned by
 * `ctx.docks.register(...)` inside the `devtools:ready` hook. Still works as a
 * shim, but emits the `NDT_DEP_0006` deprecation diagnostic.
 */
export function refreshCustomTabs(nuxt = useNuxt()) {
  deprecate(nuxt, 'NDT_DEP_0006', {
    api: 'refreshCustomTabs',
    replacement: 'onDevtoolsReady((ctx) => ctx.docks.register(...).update(...))',
  })

  return nuxt.callHook('devtools:customTabs:refresh')
}

export interface StartSubprocessReturn {
  /** @deprecated Use `getResult()` instead */
  getProcess: () => ChildProcess | undefined
  getResult: () => Result
  terminate: () => void
  restart: () => void
  clear: () => void
}

/**
 * Create a subprocess that handled by the DevTools.
 *
 * @deprecated Use the Vite DevTools terminals host from the `devtools:ready`
 * hook instead: `onDevtoolsReady((ctx) => ctx.terminals.startChildProcess(...))`.
 * Still works as a shim, but emits the `NDT_DEP_0004` deprecation diagnostic.
 */
export function startSubprocess(
  execaOptions: SubprocessOptions,
  tabOptions: TerminalState,
  nuxt = useNuxt(),
): StartSubprocessReturn {
  deprecate(nuxt, 'NDT_DEP_0004', {
    api: 'startSubprocess',
    replacement: 'onDevtoolsReady((ctx) => ctx.terminals.startChildProcess(...))',
  }, { key: tabOptions.id })

  const id = tabOptions.id
  let restarting = false

  function start() {
    const proc = x(
      execaOptions.command,
      execaOptions.args,
      {
        nodeOptions: {
          ...execaOptions.nodeOptions,
          cwd: execaOptions.cwd ?? execaOptions.nodeOptions?.cwd,
          env: {
            ...process.env,
            COLORS: 'true',
            FORCE_COLOR: 'true',
            ...execaOptions.env,
            ...execaOptions.nodeOptions?.env,
            __CLI_ARGV__: undefined,
          },
        },
      },
    )

    nuxt.callHook('devtools:terminal:write', { id, data: `> ${[execaOptions.command, ...execaOptions.args || []].join(' ')}\n\n` })

    proc.process?.stdout?.on('data', (data) => {
      nuxt.callHook('devtools:terminal:write', { id, data: data.toString() })
    })
    proc.process?.stderr?.on('data', (data) => {
      nuxt.callHook('devtools:terminal:write', { id, data: data.toString() })
    })
    proc.process?.on('exit', (code) => {
      if (!restarting) {
        nuxt.callHook('devtools:terminal:write', { id, data: `\n> process terminated with ${code}\n` })
        nuxt.callHook('devtools:terminal:exit', { id, code: code || 0 })
      }
    })

    return proc
  }

  register()
  nuxt.hook('close', () => {
    terminate()
  })

  let result = start()

  function restart() {
    restarting = true
    result.kill()

    clear()
    result = start()
    restarting = false
  }

  function clear() {
    tabOptions.buffer = ''
    register()
  }

  function terminate() {
    restarting = false
    try {
      result.kill()
    }
    catch {}
    nuxt.callHook('devtools:terminal:remove', { id })
  }

  function register() {
    nuxt.callHook('devtools:terminal:register', {
      onActionRestart: tabOptions.restartable === false ? undefined : restart,
      onActionTerminate: tabOptions.terminatable === false ? undefined : terminate,
      isTerminated: false,
      ...tabOptions,
    })
  }

  return {
    /** @deprecated Use `getResult()` instead */
    getProcess: () => {
      deprecate(nuxt, 'NDT_DEP_0001', {
        api: 'startSubprocess().getProcess()',
        replacement: 'getResult()',
      }, { key: id })
      return result.process
    },
    getResult: () => result,
    terminate,
    restart,
    clear,
  }
}

/**
 * Extend server RPC with namespaced functions.
 *
 * Returns an object with a `broadcast` proxy for calling client functions.
 *
 * @deprecated Register RPC functions from the `devtools:ready` hook instead:
 * `onDevtoolsReady((ctx) => ctx.rpc.register(defineRpcFunction(...)))`. Still
 * works as a shim, but emits the `NDT_DEP_0003` deprecation diagnostic.
 */
export function extendServerRpc<ClientFunctions extends object = Record<string, unknown>, ServerFunctions extends object = Record<string, unknown>>(
  namespace: string,
  functions: ServerFunctions,
  nuxt = useNuxt(),
): BirpcGroup<ClientFunctions, ServerFunctions> {
  const ctx = _getContext(nuxt)
  if (!ctx)
    throw new Error('[Nuxt DevTools] Failed to get devtools context.')

  return ctx.extendServerRpc<ClientFunctions, ServerFunctions>(namespace, functions)
}

export function onDevToolsInitialized(fn: (info: NuxtDevtoolsInfo) => void, nuxt = useNuxt()) {
  nuxt.hook('devtools:initialized', fn)
}

/**
 * Run a callback once the Vite DevTools kit has connected, receiving the
 * connected `ViteDevToolsNodeContext`.
 *
 * This is the recommended entry point for DevTools integration: the kit is
 * guaranteed available, so you can use `ctx.docks` / `ctx.terminals` /
 * `ctx.messages` / `ctx.commands` / `ctx.rpc` / `ctx.diagnostics` directly
 * without the connect-safe accessors on `nuxt.devtools`.
 *
 * @example
 * ```ts
 * onDevtoolsReady((ctx) => {
 *   ctx.docks.register({ id: 'my-module', title: 'My Module', type: 'iframe', url: '/…' })
 * })
 * ```
 */
export function onDevtoolsReady(fn: (ctx: ViteDevToolsNodeContext) => void | Promise<void>, nuxt = useNuxt()) {
  nuxt.hook('devtools:ready', fn)
}

function _getContext(nuxt = useNuxt()): NuxtDevtoolsServerContext | undefined {
  // @ts-expect-error - internal
  return nuxt?.devtools
}
