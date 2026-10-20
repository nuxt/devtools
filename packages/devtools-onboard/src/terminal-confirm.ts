import type { Buffer } from 'node:buffer'
import type { Readable } from 'node:stream'
import process from 'node:process'

/** As long as `@devframes/hub-ui-onboard`'s own terminal question waits (DF9008). */
const ANSWER_TIMEOUT = 5 * 60_000

export interface Terminal {
  input?: Readable & { isTTY?: boolean, isRaw?: boolean }
  /** Shows the question; nuxi's TUI pins a boxed log as an ACTION line. */
  ask: (message: string) => void
  warn: (message: string) => void
}

/**
 * The `y/N` question of `@devframes/hub-ui-onboard`, adapted to `nuxi dev`.
 * Its TUI holds stdin in raw mode, so a single key answers and the question
 * is boxed to stay visible. In plain mode nuxi's own `y` shortcut copies the
 * URL, so the answer is `yes`. Like upstream it refuses without a terminal
 * (nuxi's TUI gives the dev server's fork none) and after 5 minutes.
 */
export function confirmInTerminal(command: string[], { input = process.stdin, ask, warn }: Terminal): Promise<boolean> {
  const run = `\`${command.join(' ')}\``
  if (!input.isTTY) {
    warn(`A browser asked to install Nuxt DevTools, but no terminal can confirm it, so it was refused. Run ${run} yourself.`)
    return Promise.resolve(false)
  }
  const answerWith = input.isRaw ? 'Press y' : 'Type yes and press Enter'
  ask(`${answerWith} to allow installing Nuxt DevTools; anything else refuses.\nThe browser asked to run ${run}. If you did not click Install, refuse it: another device can reach this dev server.`)

  const flowing = input.readableFlowing
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      warn('Nobody allowed installing Nuxt DevTools within 5 minutes, so it was refused.')
      answer(false)
    }, ANSWER_TIMEOUT)
    const onData = (chunk: Buffer | string) => answer(/^y(?:es)?$/i.test(String(chunk).trim()))
    function answer(allowed: boolean) {
      clearTimeout(timer)
      input.off('data', onData)
      // Leave the stream to the TUI or readline that read it before.
      if (!flowing)
        input.pause()
      resolve(allowed)
    }
    input.on('data', onData)
  })
}
