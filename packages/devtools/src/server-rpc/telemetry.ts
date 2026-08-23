import type { NuxtHooks } from '@nuxt/schema'
import type { } from '@nuxt/telemetry'
import type { NuxtDevtoolsServerContext } from '../types'
import { version } from '../../package.json'
import { getOptions } from './options'

const SEND_DELAY = 5_000

type ArgumentsType<T> = T extends (...args: infer A) => any ? A : never

/**
 * Whether the user has opted out of tracking via the `DO_NOT_TRACK`
 * environment variable convention.
 *
 * @see https://donottrack.sh/
 */
function isDoNotTrackEnabled() {
  const value = process.env.DO_NOT_TRACK
  return value === '1' || value?.toLowerCase() === 'true'
}

function throttle<T extends () => any>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout> | undefined

  return () => {
    if (!timer) {
      timer = setTimeout(() => {
        timer = undefined
        fn()
      }, delay)
    }
  }
}

let telemetry: ArgumentsType<NuxtHooks['telemetry:setup']>[0] | undefined

const throttledSend = throttle(() => {
  telemetry?.sendEvents()
}, SEND_DELAY)

export function setupTelemetryRPC({ nuxt, options }: NuxtDevtoolsServerContext) {
  if (options.telemetry !== false && !isDoNotTrackEnabled()) {
    // Only when global telemetry is enabled, the hook will be called
    nuxt.hook('telemetry:setup', (t) => {
      telemetry = t
      // console.log('Telemetry is enabled')
      t.eventFactories.devtools = (_, payload) => {
        return {
          name: 'devtools',
          version,
          ...payload,
        }
      }
      t.createEvent('devtools', { event: 'enabled' })
    })
  }

  return {
    telemetryEvent(payload: object, immediate = false) {
      telemetryEvent(payload, immediate)
    },
  }
}

export function telemetryEvent(payload: object, immediate = false) {
  if (!telemetry)
    return

  if (getOptions()?.behavior.telemetry === false)
    return

  if (isDoNotTrackEnabled())
    return

  telemetry.createEvent('devtools', payload)

  if (immediate)
    telemetry.sendEvents()
  else
    throttledSend()
}
