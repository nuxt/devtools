import type { NuxtTerminal, NuxtTerminalNotice } from '@nuxt/kit'
import { colors } from 'consola/utils'

export interface TerminalAuthBanner {
  banner: (info: { code: string, url: string }) => void
  onTrusted: () => void
}

/**
 * Route Vite DevTools' client-auth banner through Nuxt's terminal host
 * (`useTerminal`): the Nuxt CLI 4 TUI renders it as a sticky, dismissible
 * notice, while plain terminals get useTerminal's boxed-log fallback.
 *
 * devframe rotates the code and re-prints after every exchange attempt, so
 * each print retracts the previous notice, and `onTrusted` retracts the
 * rotated-code notice that fires just before it once an exchange succeeds.
 */
export function createTerminalAuthBanner(terminal: () => NuxtTerminal): TerminalAuthBanner {
  let notice: NuxtTerminalNotice | undefined
  return {
    banner({ code, url }) {
      notice?.dismiss()
      notice = terminal().notify({
        title: colors.green('Nuxt DevTools'),
        message: `Authorize with code ${colors.inverse(colors.green(colors.bold(` ${code} `)))} or open ${colors.cyan(url)}\n`,
      })
    },
    onTrusted() {
      notice?.dismiss()
      notice = undefined
    },
  }
}
