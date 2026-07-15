import type { NuxtDevtoolsNotifyInput } from '../../src/types'
import { connectPromise, rpcClient } from './rpc'

/**
 * The devframe Messages plugin RPC that adds an entry to the shared Messages
 * host — the single notification system used across Nuxt + Vite DevTools. An
 * entry with `notify: true` also renders a transient toast in the Vite DevTools
 * chrome.
 */
const MESSAGES_ADD_RPC = 'devframes-plugin-messages:add'

/**
 * Push a notification through the devframe Messages system from the client.
 *
 * Backs both the ephemeral toast adapter (`devtoolsUiShowNotification`) and the
 * public injected client `notify()`. Defaults `level` to `info` and `notify` to
 * `true`. Fire-and-forget: notifications are best-effort UI feedback, so any
 * RPC error is swallowed.
 */
export async function notify(input: NuxtDevtoolsNotifyInput): Promise<void> {
  try {
    const client = rpcClient.value || await connectPromise
    await client.call(MESSAGES_ADD_RPC as any, {
      message: input.message,
      level: input.level ?? 'info',
      description: input.description,
      labels: input.labels,
      category: input.category,
      filePosition: input.filePosition,
      stacktrace: input.stacktrace,
      notify: input.notify ?? true,
      autoDismiss: input.autoDismiss,
      autoDelete: input.autoDelete,
    })
  }
  catch (error) {
    console.error('[nuxt-devtools] Failed to push notification', error)
  }
}
