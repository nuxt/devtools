import type { ViteDevToolsNodeContext } from '@vitejs/devtools-kit'
import type { ModuleCustomTab } from './custom-tabs'
import type { NuxtDevtoolsNotifyInput } from './notify'
import type { NuxtDevtoolsInfo } from './server-ctx'
import type { TerminalState } from './terminals'

declare module '@nuxt/schema' {
  interface NuxtHooks {
    /**
     * Called before devtools starts. Useful to detect if devtools is enabled.
     */
    'devtools:before': () => void

    /**
     * Called after devtools is initialized.
     */
    'devtools:initialized': (info: NuxtDevtoolsInfo) => void

    /**
     * Called once the Vite DevTools kit has connected, with the connected
     * `ViteDevToolsNodeContext`.
     *
     * This is the recommended place to do all DevTools integration
     * (registering docks, terminals, messages, commands, RPC functions,
     * diagnostics, …): the kit is guaranteed to be available here, so you don't
     * need the connect-safe accessors on `nuxt.devtools`.
     */
    'devtools:ready': (ctx: ViteDevToolsNodeContext) => void | Promise<void>

    /**
     * Push a notification through the devframe Messages system.
     *
     * Forwarded to the connected `ctx.messages` host, so it surfaces in the
     * Vite DevTools **Messages** dock (persistent, when leveled) and/or as a
     * transient toast (when `notify` is set). Calls made before the kit connects
     * are buffered and replayed once it does.
     *
     * @example
     * ```ts
     * nuxt.callHook('devtools:notify', { message: 'Build failed', level: 'error' })
     * ```
     */
    'devtools:notify': (input: NuxtDevtoolsNotifyInput) => void

    /**
     * Hooks to extend devtools tabs.
     */
    'devtools:customTabs': (tabs: ModuleCustomTab[]) => void

    /**
     * Retrigger update for custom tabs, `devtools:customTabs` will be called again.
     */
    'devtools:customTabs:refresh': () => void

    /**
     * Register a terminal.
     */
    'devtools:terminal:register': (terminal: TerminalState) => void

    /**
     * Write to a terminal.
     *
     * Returns true if terminal is found.
     */
    'devtools:terminal:write': (_: { id: string, data: string }) => void

    /**
     * Remove a terminal from devtools.
     *
     * Returns true if terminal is found and deleted.
     */
    'devtools:terminal:remove': (_: { id: string }) => void

    /**
     * Mark a terminal as terminated.
     */
    'devtools:terminal:exit': (_: { id: string, code?: number }) => void
  }
}

declare module '@nuxt/schema' {
  /**
   * Runtime Hooks
   */
  interface RuntimeNuxtHooks {
    /**
     * On terminal data.
     */
    'devtools:terminal:data': (payload: { id: string, data: string }) => void
  }
}

export {}
