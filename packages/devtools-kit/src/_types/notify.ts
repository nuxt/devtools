import type { DevToolsMessageFilePosition, DevToolsMessageLevel } from '@vitejs/devtools-kit'

/**
 * Severity level of a notification, mirroring devframe's message levels.
 *
 * Determines the color/icon of the entry in the Vite DevTools **Messages** dock
 * and its toast.
 */
export type NuxtDevtoolsNotifyLevel = DevToolsMessageLevel

/**
 * A Nuxt-friendly subset of devframe's `DevframeMessageEntryInput`.
 *
 * This is the input accepted by the `devtools:notify` Nuxt hook, the `notify`
 * RPC function and the injected client's `notify()` — all of which forward to
 * the connected `ctx.messages` host so notifications flow through the single
 * devframe Messages system (persistent dock list + toast overlay).
 *
 * Tiers are expressed through the flags below:
 * - **Ephemeral** (toast-only feedback like "Copied!"): `notify: true` with an
 *   `autoDismiss` (toast lifetime) and `autoDelete` (entry lifetime) so it never
 *   builds up history in the Messages dock.
 * - **Persistent** (server-originated, leveled): omit `autoDelete` so the entry
 *   is kept in the Messages dock list.
 */
export interface NuxtDevtoolsNotifyInput {
  /** Short title / summary of the message. */
  message: string
  /** Severity level. Defaults to `'info'`. */
  level?: NuxtDevtoolsNotifyLevel
  /** Optional detailed description or explanation. */
  description?: string
  /** Optional tags/labels for filtering in the Messages dock. */
  labels?: string[]
  /** Optional grouping category (e.g. `'build'`, `'lint'`, `'runtime'`). */
  category?: string
  /** Optional source file position (e.g. for a build/lint error). */
  filePosition?: DevToolsMessageFilePosition
  /** Optional stack trace string. */
  stacktrace?: string
  /** Whether this message should also appear as a transient toast. */
  notify?: boolean
  /** Time in ms to auto-dismiss the toast (client-side). */
  autoDismiss?: number
  /** Time in ms to auto-delete the entry from the persistent list (server-side). */
  autoDelete?: number
}
