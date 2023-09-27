let _showNotification: typeof showNotification

export type Position = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'

export function showNotification(data: {
  message: string
  icon?: string
  classes?: string
  duration?: number
  position?: Position
}) {
  _showNotification?.(data)
}

export function provideNotificationFn(fn: typeof showNotification) {
  _showNotification = fn
}
