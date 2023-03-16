import { useNuxt } from '@nuxt/kit'
import type { BirpcGroup } from 'birpc'
import { execa } from 'execa'
import type { ModuleCustomTab, NuxtDevtoolsServerContext, SubprocessOptions, TerminalState } from './types'

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

  function start() {
    const process = execa(
      execaOptions.command,
      execaOptions.args,
      {
        ...execaOptions,
        env: {
          COLORS: 'true',
          FORCE_COLOR: 'true',
          ...execaOptions.env,
        },
      },
    )

    nuxt.callHook('devtools:terminal:write', id, `> ${[execaOptions.command, ...execaOptions.args || []].join(' ')}\n\n`)

    process.stdout!.on('data', (data) => {
      nuxt.callHook('devtools:terminal:write', id, data)
    })
    process.stderr!.on('data', (data) => {
      nuxt.callHook('devtools:terminal:write', id, data)
    })
    process.on('exit', (code) => {
      nuxt.callHook('devtools:terminal:write', id, `\n> process terminalated with ${code}\n`)
    })

    return process
  }

  register()
  nuxt.hook('close', () => {
    terminate()
  })

  let process = start()

  function restart() {
    process?.kill()

    clear()
    process = start()
  }

  function clear() {
    tabOptions.buffer = ''
    register()
  }

  function terminate() {
    try {
      process?.kill()
    }
    catch (e) {
    }
    nuxt.callHook('devtools:terminal:remove', id)
  }

  function register() {
    nuxt.callHook('devtools:terminal:register', {
      onActionRestart: restart,
      onActionTerminate: terminate,
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

export function extendServerRpc<ClientFunctions = {}, ServerFunctions = {}>(
  namespace: string,
  functions: ServerFunctions,
  nuxt = useNuxt(),
): BirpcGroup<ClientFunctions, ServerFunctions> {
  const ctx = _getContext(nuxt)
  if (!ctx)
    throw new Error('Failed to get devtools context.')

  return ctx.extendServerRpc<ClientFunctions, ServerFunctions>(namespace, functions)
}

export function onDevToolsInitialized(fn: () => void, nuxt = useNuxt()) {
  nuxt.hook('devtools:initialized', fn)
}

function _getContext(nuxt = useNuxt()): NuxtDevtoolsServerContext | undefined {
  // @ts-expect-error - internal
  return nuxt?.devtools
}
