import type { ComputedRef } from 'vue'
import type { DevToolsLocale } from '../i18n/locales'
import { matchLocale } from '@devframes/hub'
import { useLocalStorage, useNavigatorLanguage } from '@vueuse/core'
import { computed, shallowRef, watch } from 'vue'
import { DEFAULT_LOCALE, DEVFRAME_LOCALE_STORAGE_KEY, DEVTOOLS_LOCALES, LOCALE_AUTO } from '../i18n/locales'
import { rpcClient } from './rpc'

const available = Object.keys(DEVTOOLS_LOCALES) as DevToolsLocale[]

/** Closest supported DevTools locale for a BCP 47 tag, using Devframe's matching rules. */
export function matchDevToolsLocale(tag: string | undefined | null): DevToolsLocale | undefined {
  return matchLocale(tag ?? undefined, available) as DevToolsLocale | undefined
}

let preference: ReturnType<typeof useLocalStorage<string>> | undefined

/**
 * The visitor's language pick, shared with the Devframe hub UI: `'auto'` or a
 * locale tag. Backed by the hub's own `localStorage` key, so a change in the
 * hub's Settings → Appearance reaches DevTools live (via the `storage` event),
 * and a change made here reaches the hub.
 */
export function useLocalePreference() {
  preference ??= useLocalStorage<string>(DEVFRAME_LOCALE_STORAGE_KEY, LOCALE_AUTO, {
    // Don't write the default: an absent key already means `auto` to the hub.
    writeDefaults: false,
    listenToStorageChanges: true,
  })
  return preference
}

/** The raw stored pick, read directly so it reflects the moment of the call. */
function readStoredPreference(): string {
  try {
    return localStorage.getItem(DEVFRAME_LOCALE_STORAGE_KEY) || LOCALE_AUTO
  }
  catch {
    return LOCALE_AUTO
  }
}

let resolved: ComputedRef<DevToolsLocale> | undefined

/**
 * The language DevTools renders in, resolved the same way the Devframe hub UI
 * resolves its own:
 *
 * 1. the visitor's pick in the hub settings (unless `auto`);
 * 2. the host's default, from `configs.ui.locale` in the connection meta;
 * 3. the browser language;
 * 4. English.
 */
export function useDevToolsLocale(): ComputedRef<DevToolsLocale> {
  if (resolved)
    return resolved

  const pick = useLocalePreference()
  const { language } = useNavigatorLanguage()

  // `configs.ui.locale` is not a stable host default: the running hub UI
  // overwrites it with the language it resolved, and an embedded frame shares
  // the hub's connection object (devframe reads it from the parent window).
  // Capture it once, on connect, and only while the pick is `auto`: then the
  // value is exactly the hub's own auto result (host default, else browser),
  // never a leftover explicit pick. The value is not reactive, so later
  // writes by the hub are ignored on purpose.
  const hostDefault = shallowRef<DevToolsLocale>()
  watch(rpcClient, (client) => {
    if (!client || hostDefault.value)
      return
    if (readStoredPreference() !== LOCALE_AUTO)
      return
    const configs = client.connectionMeta?.configs as { ui?: { locale?: string } } | undefined
    hostDefault.value = matchDevToolsLocale(configs?.ui?.locale)
  }, { immediate: true })

  resolved = computed<DevToolsLocale>(() => {
    if (pick.value && pick.value !== LOCALE_AUTO) {
      const matched = matchDevToolsLocale(pick.value)
      if (matched)
        return matched
    }

    if (hostDefault.value)
      return hostDefault.value

    // Read `language` unconditionally so the `languagechange` event
    // re-evaluates this, then prefer the full `navigator.languages` list.
    const primary = language.value
    const languages = typeof navigator !== 'undefined' && navigator.languages?.length
      ? navigator.languages
      : [primary]
    for (const tag of languages) {
      const matched = matchDevToolsLocale(tag)
      if (matched)
        return matched
    }

    return DEFAULT_LOCALE
  })
  return resolved
}
