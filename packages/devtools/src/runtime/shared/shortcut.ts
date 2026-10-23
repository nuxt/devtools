// DevTools is toggled with `Shift + Alt + D`. `KeyboardEvent.code` describes
// the physical key position, so it only matches the letter D on a QWERTY
// layout. Users on Workman, Colemak, etc. press a different physical key, and
// macOS rewrites the produced character while Option is held (`d` -> `∂`,
// with Shift -> `Î`). Resolve the keys that actually type `d` in the active
// layout and fall back to the produced key and the legacy key code.

interface KeyboardLayoutMapLike {
  forEach: (callback: (key: string, code: string) => void) => void
}

interface KeyboardLike {
  getLayoutMap: () => Promise<KeyboardLayoutMapLike>
  addEventListener?: (type: 'layoutchange', listener: () => void) => void
}

export interface DevtoolsShortcutEvent {
  altKey: boolean
  shiftKey: boolean
  ctrlKey?: boolean
  metaKey?: boolean
  code?: string
  key?: string
  keyCode?: number
}

export interface DevtoolsShortcutOptions {
  /** Require Shift to be held. Opening requires it; closing from the panel does not. */
  shift?: boolean
  /** Physical codes that type `d` in the active layout. Exposed for testing. */
  codes?: ReadonlySet<string>
}

const D_KEY_CODE = 68
const QWERTY_D_CODE = 'KeyD'

const shortcutCodes = new Set([QWERTY_D_CODE])

export function resolveShortcutCodes(layout: KeyboardLayoutMapLike): Set<string> {
  const codes = new Set<string>()
  layout.forEach((key, code) => {
    if (key.toLowerCase() === 'd')
      codes.add(code)
  })
  return codes
}

function getKeyboard(): KeyboardLike | undefined {
  if (typeof navigator === 'undefined')
    return
  return (navigator as Navigator & { keyboard?: KeyboardLike }).keyboard
}

let watching = false

/**
 * Track the active keyboard layout so the shortcut follows the key that types
 * `d` instead of its physical QWERTY position. The Keyboard API is
 * Chromium-only and may be blocked inside iframes, so failures are ignored.
 */
export function watchShortcutLayoutMap(): void {
  if (watching)
    return
  watching = true

  const keyboard = getKeyboard()
  if (!keyboard?.getLayoutMap)
    return

  const refresh = () => {
    try {
      keyboard.getLayoutMap()
        .then((layout) => {
          const codes = resolveShortcutCodes(layout)
          // Keep the QWERTY fallback if the map unexpectedly has no letter D.
          if (!codes.size)
            return
          shortcutCodes.clear()
          for (const code of codes)
            shortcutCodes.add(code)
        })
        .catch(() => {})
    }
    catch {
      // Blocked by a permissions policy. `code`, `key` and `keyCode` matching
      // still work without the layout map.
    }
  }

  refresh()
  keyboard.addEventListener?.('layoutchange', refresh)
}

export function isDevtoolsShortcut(
  event: DevtoolsShortcutEvent,
  options: DevtoolsShortcutOptions = {},
): boolean {
  if (!event.altKey)
    return false
  if (options.shift && !event.shiftKey)
    return false
  if (event.ctrlKey || event.metaKey)
    return false

  const codes = options.codes ?? shortcutCodes
  if (event.code && codes.has(event.code))
    return true

  if (event.key?.toLowerCase() === 'd')
    return true

  // Deprecated, but it identifies the key produced by the active layout and
  // ignores modifiers, which matters on macOS where Option rewrites `key`.
  return event.keyCode === D_KEY_CODE
}
