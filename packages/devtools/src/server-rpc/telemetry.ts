import type { } from '@nuxt/telemetry'
import type { NuxtHooks } from '@nuxt/schema'
import type { NuxtDevtoolsServerContext } from '../types'
import { version } from '../../package.json'

const SEND_DELAY = 10_000

type ArgumentsType<T> = T extends (...args: infer A) => any ? A : never

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
          debug: true,
          ...payload,
        }
      }
    })
  }

  let timer: ReturnType<typeof setTimeout> | undefined

  return {
    telemetryEvent(payload: object) {
      if (!telemetry)
        return
      telemetry.createEvent('devtools', payload)
      if (timer)
        clearTimeout(timer)
      timer = setTimeout(() => {
        telemetry!.sendEvents()
      }, SEND_DELAY)
    },
  }
}