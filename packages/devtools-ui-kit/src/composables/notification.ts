let _devtoolsUiShowNotification: typeof devtoolsUiShowNotification

export type DevtoolsUiShowNotificationPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'

export function devtoolsUiShowNotification(data: {
  message: string
  icon?: string
  classes?: string
  duration?: number
  position?: DevtoolsUiShowNotificationPosition
}) {
  _devtoolsUiShowNotification?.(data)
}

export function devtoolsUiProvideNotificationFn(fn: typeof devtoolsUiShowNotification) {
  _devtoolsUiShowNotification = fn
}
