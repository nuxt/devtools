import { useNuxt } from '@nuxt/kit'
import type { Options as ExecaOptions } from 'execa'
import { execa } from 'execa'
import type { ModuleCustomTab } from '../types'
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
  name: string
  command: string
  args?: string[]
}

/**
 * Create a subprocess that handled by the DevTools.
 */
export function startSubprocess(options: SubprocessOptions, nuxt = useNuxt()) {
  const process = execa(
    options.command,
    options.args,
    {
      ...options,
      env: {
        COLORS: 'true',
        FORCE_COLOR: 'true',
        ...options.env,
      },
    },
  )

  const id = (process.pid || options.command).toString()
  nuxt.callHook('devtools:terminal:register', {
    id,
    name: options.name,
    stream: process.stdout!,
  })

  process.on('exit', () => {
    // TODO: unregister terminal
  })

  return process
}
