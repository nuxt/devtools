import type { DevToolsMessageEntryInput, DevToolsMessagesHost, ViteDevToolsNodeContext } from '@vitejs/devtools-kit'
import type { Nuxt } from 'nuxt/schema'
import type { NuxtDevtoolsNotifyInput, NuxtDevtoolsServerContext, ServerFunctions } from '../types'
import { onDevtoolsReady } from '@nuxt/devtools-kit'

/**
 * Map the Nuxt-friendly {@link NuxtDevtoolsNotifyInput} onto devframe's
 * `DevToolsMessageEntryInput`, defaulting the level to `info`.
 */
function toEntryInput(input: NuxtDevtoolsNotifyInput): DevToolsMessageEntryInput {
  return {
    message: input.message,
    level: input.level ?? 'info',
    description: input.description,
    labels: input.labels,
    category: input.category,
    filePosition: input.filePosition,
    stacktrace: input.stacktrace,
    notify: input.notify,
    autoDismiss: input.autoDismiss,
    autoDelete: input.autoDelete,
  }
}

/**
 * Create the notify machinery that forwards notifications into the connected
 * devframe `ctx.messages` host.
 *
 * The connected context is captured from `onDevtoolsReady` (which only fires
 * post-connect, so there is no queue to manage for the host itself); any
 * `notify(...)` calls made before that are buffered here and replayed once the
 * kit connects. Registers the `devtools:notify` Nuxt hook so modules can push
 * notifications without importing anything.
 */
export function createNotifier(nuxt: Nuxt): (input: NuxtDevtoolsNotifyInput) => void {
  let messages: DevToolsMessagesHost | undefined
  const pending: NuxtDevtoolsNotifyInput[] = []

  function add(input: NuxtDevtoolsNotifyInput) {
    // Fire-and-forget: notifications are best-effort UI feedback.
    void messages!.add(toEntryInput(input)).catch(() => {})
  }

  function notify(input: NuxtDevtoolsNotifyInput) {
    if (!messages) {
      pending.push(input)
      return
    }
    add(input)
  }

  onDevtoolsReady((kit: ViteDevToolsNodeContext) => {
    messages = kit.messages
    for (const input of pending)
      add(input)
    pending.length = 0
  }, nuxt)

  nuxt.hook('devtools:notify', notify)

  return notify
}

/**
 * Expose the `notify` server function so the client can push server-persisted
 * notifications through the same devframe Messages system.
 */
export function setupMessagesRPC(ctx: NuxtDevtoolsServerContext) {
  return {
    async notify(input: NuxtDevtoolsNotifyInput) {
      ctx.notify(input)
    },
  } satisfies Partial<ServerFunctions>
}
