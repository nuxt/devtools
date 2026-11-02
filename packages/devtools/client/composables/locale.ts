import type { DevToolsRpcClient } from '@vitejs/devtools-kit/client'
import type { ComputedRef, Ref } from 'vue'
import type { DevToolsLocale } from '../i18n/locales'
import { matchLocale } from '@devframes/hub'
import { useLocalStorage, useNavigatorLanguage } from '@vueuse/core'
import { computed, ref, shallowRef, watch } from 'vue'
import { DEFAULT_LOCALE, DEVFRAME_LOCALE_STORAGE_KEY, DEVTOOLS_LOCALES, LOCALE_AUTO } from '../i18n/locales'
import { rpcClient } from './rpc'

const available = Object.keys(DEVTOOLS_LOCALES) as DevToolsLocale[]

/** Closest supported DevTools locale for a BCP 47 tag, using Devframe's matching rules. */
export function matchDevToolsLocale(tag: string | undefined | null): DevToolsLocale | undefined {
  return matchLocale(tag ?? undefined, available) as DevToolsLocale | undefined
}

/**
 * The visitor's language pick, owned by the Devframe hub UI (Settings →
 * Appearance): `'auto'` or a locale tag. DevTools only reads the hub's own
 * `localStorage` key, so a change in the hub reaches DevTools live via the
 * `storage` event.
 */
function useLocalePreference(): Ref<string> {
  try {
    return useLocalStorage<string>(DEVFRAME_LOCALE_STORAGE_KEY, LOCALE_AUTO, {
      // Never write: an absent key already means `auto` to the hub.
      writeDefaults: false,
      listenToStorageChanges: true,
    })
  }
  catch {
    // Reading `window.localStorage` throws when the browser blocks storage.
    // Fall back to `auto` rather than failing the whole client at startup.
    return ref(LOCALE_AUTO)
  }
}

/**
 * The host's default language, as the server published it in
 * `__connection.json` (`createUi({ locale })` → `configs.ui.locale`).
 *
 * The live `client.connectionMeta` can't be used for this: the running hub UI
 * overwrites `configs.ui.locale` there with the language it resolved, and an
 * embedded frame shares the hub's connection object (devframe reads it from
 * the parent window). Fetching the descriptor again gives the untouched value.
 */
async function fetchHostDefault(client: DevToolsRpcClient): Promise<DevToolsLocale | undefined> {
  try {
    const response = await fetch(client.connection.metaBaseUrl)
    if (!response.ok)
      return undefined
    const meta = await response.json() as { configs?: { ui?: { locale?: string } } }
    return matchDevToolsLocale(meta.configs?.ui?.locale)
  }
  catch {
    return undefined
  }
}

let resolved: ComputedRef<DevToolsLocale> | undefined

/**
 * The language DevTools renders in, resolved the same way the Devframe hub UI
 * resolves its own:
 *
 * 1. the visitor's pick in the hub settings (unless `auto`);
 * 2. the host's default, `configs.ui.locale` in `__connection.json`;
 * 3. the browser language;
 * 4. English.
 */
export function useDevToolsLocale(): ComputedRef<DevToolsLocale> {
  if (resolved)
    return resolved

  const pick = useLocalePreference()
  const { language } = useNavigatorLanguage()

  const hostDefault = shallowRef<DevToolsLocale>()
  let hostDefaultRequested = false
  watch(rpcClient, async (client) => {
    if (!client || hostDefaultRequested)
      return
    hostDefaultRequested = true
    hostDefault.value = await fetchHostDefault(client)
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
