import type { NuxtDevtoolsNotifyInput } from '../../src/types'
import { buildMessageEntry, MESSAGES_ADD_RPC } from '../../src/notify-transport'
import { connectPromise, rpcClient } from './rpc'

/**
 * Push a notification through the Devframe Messages system from the client.
 *
 * Backs both the ephemeral toast adapter (`devtoolsUiShowNotification`) and the
 * public injected client `notify()`. Defaults `level` to `info` and `notify` to
 * `true` (see {@link buildMessageEntry}). Fire-and-forget: notifications are
 * best-effort UI feedback, so any RPC error is swallowed.
 */
export async function notify(input: NuxtDevtoolsNotifyInput): Promise<void> {
  try {
    const client = rpcClient.value || await connectPromise
    await client.call(MESSAGES_ADD_RPC as any, buildMessageEntry(input))
  }
  catch (error) {
    console.error('[nuxt-devtools] Failed to push notification', error)
  }
}
