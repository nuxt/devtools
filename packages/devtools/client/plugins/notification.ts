import type { NuxtDevtoolsNotifyInput } from '../../src/types'
import { defineNuxtPlugin, devtoolsUiProvideNotificationFn } from '#imports'
import { notify } from '../composables/notify'

/** Default toast lifetime, in ms, when a caller does not specify a duration. */
const DEFAULT_TOAST_DURATION = 3000
/** Extra time, in ms, the persistent entry lingers past the toast before it is auto-deleted. */
const ENTRY_LINGER = 2000

/**
 * Best-effort severity inference for legacy `devtoolsUiShowNotification` callers
 * that convey intent through `classes`/`icon` rather than an explicit `level`.
 */
function inferLevel(data: { level?: NuxtDevtoolsNotifyInput['level'], classes?: string, icon?: string }): NonNullable<NuxtDevtoolsNotifyInput['level']> {
  if (data.level)
    return data.level

  const hint = `${data.classes ?? ''} ${data.icon ?? ''}`
  if (/red|error|danger/.test(hint))
    return 'error'
  if (/orange|yellow|warn/.test(hint))
    return 'warn'
  if (/green|success|checkmark/.test(hint))
    return 'success'
  return 'info'
}

/**
 * Wire the Nuxt DevTools ephemeral toast onto the devframe Messages system.
 *
 * Registers the concrete implementation behind the UI kit's
 * `devtoolsUiShowNotification` proxy: every call becomes a toast-only devframe
 * message (`notify: true`, with `autoDismiss` + `autoDelete`) so ephemeral
 * feedback never builds up history in the Messages dock.
 */
export default defineNuxtPlugin(() => {
  devtoolsUiProvideNotificationFn((data) => {
    const duration = data.duration ?? DEFAULT_TOAST_DURATION
    void notify({
      message: data.message,
      level: inferLevel(data),
      notify: true,
      autoDismiss: duration,
      autoDelete: duration + ENTRY_LINGER,
    })
  })
})
