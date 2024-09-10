import { useNuxt } from '@nuxt/kit'
import { execa } from 'execa'
import type { BirpcGroup } from 'birpc'
import type { ModuleCustomTab, NuxtDevtoolsInfo, NuxtDevtoolsServerContext, SubprocessOptions, TerminalState } from './types'

/**
 * Hooks to extend a custom tab in devtools.
 *
 * Provide a function to pass a factory that can be updated dynamically.
 */
export function addCustomTab(tab: ModuleCustomTab | (() => ModuleCustomTab | Promise<ModuleCustomTab>), nuxt = useNuxt()) {
  nuxt.hook('devtools:customTabs', async (tabs) => {
    if (typeof tab === 'function')
      tab = await tab()
    tabs.push(tab)
  })
}

/**
 * Retrigger update for custom tabs, `devtools:customTabs` will be called again.
 */
export function refreshCustomTabs(nuxt = useNuxt()) {
  return nuxt.callHook('devtools:customTabs:refresh')
}

/**
 * Create a subprocess that handled by the DevTools.
 */
export function startSubprocess(
  execaOptions: SubprocessOptions,
  tabOptions: TerminalState,
  nuxt = useNuxt(),
) {
  const id = tabOptions.id
  let restarting = false

  function start() {
    const process = execa(
      execaOptions.command,
      execaOptions.args,
      {
        reject: false,
        ...execaOptions,
        env: {
          COLORS: 'true',
          FORCE_COLOR: 'true',
          ...execaOptions.env,
          // Force disable Nuxi CLI override
          __CLI_ARGV__: undefined,
        },
      },
    )

    nuxt.callHook('devtools:terminal:write', { id, data: `> ${[execaOptions.command, ...execaOptions.args || []].join(' ')}\n\n` })

    process.stdout!.on('data', (data) => {
      nuxt.callHook('devtools:terminal:write', { id, data: data.toString() })
    })
    process.stderr!.on('data', (data) => {
      nuxt.callHook('devtools:terminal:write', { id, data: data.toString() })
    })
    process.on('exit', (code) => {
      if (!restarting) {
        nuxt.callHook('devtools:terminal:write', { id, data: `\n> process terminalated with ${code}\n` })
        nuxt.callHook('devtools:terminal:exit', { id, code: code || 0 })
      }
    })

    return process
  }

  register()
  nuxt.hook('close', () => {
    terminate()
  })

  let process = start()

  function restart() {
    restarting = true
    process?.kill()

    clear()
    process = start()
    restarting = false
  }

  function clear() {
    tabOptions.buffer = ''
    register()
  }

  function terminate() {
    restarting = false
    try {
      process?.kill()
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
    getProcess() {
      return process
    },
    terminate,
    restart,
    clear,
  }
}

export function extendServerRpc<ClientFunctions = Record<string, never>, ServerFunctions = Record<string, never>>(
  namespace: string,
  functions: ServerFunctions,
  nuxt = useNuxt(),
): BirpcGroup<ClientFunctions, ServerFunctions> {
  const ctx = _getContext(nuxt)
  if (!ctx)
    throw new Error('Failed to get devtools context.')

  return ctx.extendServerRpc<ClientFunctions, ServerFunctions>(namespace, functions)
}

export function onDevToolsInitialized(fn: (info: NuxtDevtoolsInfo) => void, nuxt = useNuxt()) {
  nuxt.hook('devtools:initialized', fn)
}

function _getContext(nuxt = useNuxt()): NuxtDevtoolsServerContext | undefined {
  // @ts-expect-error - internal
  return nuxt?.devtools
}
