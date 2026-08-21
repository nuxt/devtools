import { RPC_NAMESPACE } from '../../src/rpc-namespace'
import { userAgentInfo } from './dev-auth'
import { connectPromise, rpcClient } from './rpc'
import { useDevToolsOptions } from './storage-options'

export const telemetryEnabled = useDevToolsOptions('behavior').telemetry

export function telemetry(event: string, payload?: object, immediate = false) {
  if (telemetryEnabled.value === false)
    return

  const send = async () => {
    const client = rpcClient.value || await connectPromise
    return client.call(`${RPC_NAMESPACE}:telemetryEvent` as any, {
      event,
      browser: userAgentInfo.browser.name,
      browserVersion: userAgentInfo.browser.version,
      os: userAgentInfo.os.name,
      osVersion: userAgentInfo.os.version,
      deviceType: userAgentInfo.device.type,
      ...payload,
    }, immediate)
  }

  send().catch((error) => {
    // Telemetry is best-effort: a transient RPC failure (e.g. the connection
    // was torn down and re-established after a dev-server reload) should
    // never surface to the user as an uncaught error.
    console.error('[nuxt-devtools] Failed to send telemetry event', error)
  })
}
