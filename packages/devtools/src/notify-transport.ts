import type { NuxtDevtoolsNotifyInput } from './types'

/**
 * The Devframe hub RPC that adds an entry to the shared Messages host — the
 * single notification system used across Nuxt + Vite DevTools. `hub:messages:add`
 * is Devframe 0.7's stable hub boundary (it replaces the removed Devframe 0.6
 * `devframes-plugin-messages:add`). An entry with `notify: true` also renders a
 * transient toast in the Vite DevTools chrome.
 */
export const MESSAGES_ADD_RPC = 'hub:messages:add'

/**
 * Map a Nuxt-friendly {@link NuxtDevtoolsNotifyInput} onto the `hub:messages:add`
 * payload. Defaults `level` to `info` and `notify` to `true`; `autoDismiss` /
 * `autoDelete` are millisecond lifetimes (never booleans).
 */
export function buildMessageEntry(input: NuxtDevtoolsNotifyInput) {
  return {
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
  }
}
