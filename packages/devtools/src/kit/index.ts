import { useNuxt } from '@nuxt/kit'
import type { Options as ExecaOptions } from 'execa'
import { execa } from 'execa'
import type { ModuleCustomTab, TerminalInfo } from '../types'
import type {} from '../types/hooks'

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

interface SubprocessOptions extends ExecaOptions {
  command: string
  args?: string[]
}

/**
 * Create a subprocess that handled by the DevTools.
 */
export function startSubprocess(execaOptions: SubprocessOptions, tabOptions: TerminalInfo, nuxt = useNuxt()) {
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

  const id = (tabOptions.id || process.pid || execaOptions.command).toString()
  nuxt.callHook('devtools:terminal:register', {
    ...tabOptions,
    id,
    streams: [
      process.stdout!,
      process.stderr!,
    ],
  })

  process.on('exit', () => {
    // TODO: unregister terminal
  })

  return process
}
