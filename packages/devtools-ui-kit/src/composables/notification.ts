let _devtoolsUiShowNotification: typeof devtoolsUiShowNotification

export type DevtoolsUiShowNotificationPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'

/**
 * Severity of an ephemeral notification. Mirrors devframe's message levels; the
 * concrete implementation (provided by the Nuxt DevTools client) maps this onto
 * a devframe message so the toast picks up the matching color/icon.
 */
export type DevtoolsUiShowNotificationLevel = 'info' | 'warn' | 'error' | 'success' | 'debug'

export interface DevtoolsUiShowNotificationData {
  message: string
  icon?: string
  classes?: string
  /**
   * Severity of the notification. When omitted the implementation infers it
   * from `classes`/`icon` (best-effort), defaulting to `info`.
   */
  level?: DevtoolsUiShowNotificationLevel
  /**
   * Toast lifetime, in ms.
   *
   * @remarks Best-effort — the concrete implementation may forward this to the
   * host toast, which ultimately owns placement and timing.
   */
  duration?: number
  /**
   * @deprecated Placement is owned by the Vite DevTools chrome toast; this is a
   * no-op and kept only for backward compatibility.
   */
  position?: DevtoolsUiShowNotificationPosition
}

/**
 * Show an ephemeral toast notification.
 *
 * This is a thin proxy: the Nuxt DevTools client provides the concrete
 * implementation via {@link devtoolsUiProvideNotificationFn} at startup, which
 * routes the toast through the devframe Messages system. Fire-and-forget.
 */
export function devtoolsUiShowNotification(data: DevtoolsUiShowNotificationData) {
  _devtoolsUiShowNotification?.(data)
}

export function devtoolsUiProvideNotificationFn(fn: typeof devtoolsUiShowNotification) {
  _devtoolsUiShowNotification = fn
}
