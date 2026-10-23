import { COLOR_MODE_OVERRIDE_STORAGE_KEY, COLOR_MODE_STORAGE_KEY } from '../../../devtools-ui-kit/src/constants'

export { COLOR_MODE_OVERRIDE_STORAGE_KEY, COLOR_MODE_STORAGE_KEY }

function readStorage(key: string) {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage.getItem(key)
  }
  catch {
    // Storage can be unavailable in restricted contexts.
    return null
  }
}

function writeStorage(key: string, value: string) {
  try {
    if (typeof localStorage !== 'undefined')
      localStorage.setItem(key, value)
  }
  catch {
    // Storage can be unavailable in restricted contexts.
  }
}

/**
 * Decide whether the host app's color mode may replace the DevTools mode.
 *
 * The old storage value cannot tell whether a saved light/dark mode came from
 * the user or from the host sync. Preserve it as an explicit choice instead of
 * risking a reset; fresh installs store `auto`, so they still follow the host.
 */
export function shouldApplyHostColorMode() {
  const override = readStorage(COLOR_MODE_OVERRIDE_STORAGE_KEY)
  if (override != null)
    return override === 'false'

  const mode = readStorage(COLOR_MODE_STORAGE_KEY)
  const preserve = mode === 'light' || mode === 'dark'
  writeStorage(COLOR_MODE_OVERRIDE_STORAGE_KEY, preserve ? 'true' : 'false')
  return !preserve
}
