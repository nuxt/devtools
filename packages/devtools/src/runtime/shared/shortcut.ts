// `code` is the physical QWERTY position, and on macOS Option rewrites `key`
// (`d` -> `∂` / `Î`). `keyCode` (deprecated but universally supported) follows
// the active layout and ignores modifiers.

export interface DevtoolsShortcutEvent {
  altKey: boolean
  shiftKey: boolean
  ctrlKey?: boolean
  metaKey?: boolean
  key?: string
  keyCode?: number
}

const D_KEY_CODE = 68

export function isDevtoolsShortcut(
  event: DevtoolsShortcutEvent,
  requireShift = true,
): boolean {
  return event.altKey
    && (!requireShift || event.shiftKey)
    && !event.ctrlKey
    && !event.metaKey
    && (event.key?.toLowerCase() === 'd' || event.keyCode === D_KEY_CODE)
}
