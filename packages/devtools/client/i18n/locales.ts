/**
 * UI languages Nuxt DevTools ships translations for. Mirrors
 * `HUB_UI_LOCALES` from `@devframes/hub-ui`, so DevTools speaks every
 * language the Devframe hub UI offers. Each key needs a matching
 * `client/locales/<key>.json` (checked by `x18n check` and the unit test).
 */
export const DEVTOOLS_LOCALES = {
  'en': 'English',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  'ja': '日本語',
  'ko': '한국어',
  'es': 'Español',
  'fr': 'Français',
  'de': 'Deutsch',
  'pt-BR': 'Português (Brasil)',
  'ru': 'Русский',
} as const

export type DevToolsLocale = keyof typeof DEVTOOLS_LOCALES

export const DEFAULT_LOCALE: DevToolsLocale = 'en'

/**
 * The `localStorage` key the Devframe hub UI keeps the visitor's language
 * pick under (Settings → Appearance), `'auto'` or a locale tag. The DevTools
 * client is served from the same origin as the hub and only reads this key,
 * so the hub stays the single place to change the language.
 */
export const DEVFRAME_LOCALE_STORAGE_KEY = 'devframes-locale'

export const LOCALE_AUTO = 'auto'
