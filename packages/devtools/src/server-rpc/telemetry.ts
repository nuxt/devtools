import type { } from '@nuxt/telemetry'
import type { NuxtHooks } from '@nuxt/schema'
import type { NuxtDevtoolsServerContext } from '../types'
import { version } from '../../package.json'

const SEND_DELAY = 5_000

type ArgumentsType<T> = T extends (...args: infer A) => any ? A : never

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

export function setupTelemetryRPC({ nuxt, options }: NuxtDevtoolsServerContext) {
  let telemetry: ArgumentsType<NuxtHooks['telemetry:setup']>[0] | undefined

  if (options.telemetry !== false) {
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

  const throttledSend = throttle(() => {
    telemetry?.sendEvents()
  }, SEND_DELAY)

  return {
    telemetryEvent(payload: object, immediate = false) {
      if (!telemetry)
        return

      telemetry.createEvent('devtools', payload)

      if (immediate)
        telemetry.sendEvents()
      else
        throttledSend()
    },
  }
}
