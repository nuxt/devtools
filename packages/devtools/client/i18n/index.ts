import type { DevToolsLocale } from './locales'
import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import { DEFAULT_LOCALE } from './locales'

export type MessageSchema = typeof en

/**
 * Lazy loaders for every non-default locale. English is bundled eagerly as
 * the fallback (and the message schema); the others are split into their own
 * chunks and only fetched when the visitor actually switches to them.
 */
const loaders: Record<Exclude<DevToolsLocale, 'en'>, () => Promise<{ default: MessageSchema }>> = {
  'zh-CN': () => import('../locales/zh-CN.json'),
  'zh-TW': () => import('../locales/zh-TW.json'),
  'ja': () => import('../locales/ja.json'),
  'ko': () => import('../locales/ko.json'),
  'es': () => import('../locales/es.json'),
  'fr': () => import('../locales/fr.json'),
  'de': () => import('../locales/de.json'),
  'pt-BR': () => import('../locales/pt-BR.json'),
  'ru': () => import('../locales/ru.json'),
}

/**
 * Russian has three plural forms: `one | few | many`
 * (1 страница, 2 страницы, 5 страниц).
 */
function russianPlural(choice: number, choicesLength: number): number {
  if (choicesLength < 3) {
    return choice === 1
      ? 0
      : 1
  }
  const mod10 = choice % 10
  const mod100 = choice % 100
  if (mod10 === 1 && mod100 !== 11)
    return 0
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20))
    return 1
  return 2
}

/**
 * The single i18n instance of the DevTools client. Exported so composables
 * running outside a component (tab lists, commands) can translate with
 * `i18n.global.t`, which stays reactive to locale changes.
 */
export const i18n = createI18n<[MessageSchema], DevToolsLocale, false>({
  legacy: false,
  globalInjection: true,
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  messages: { [DEFAULT_LOCALE]: en } as Record<DevToolsLocale, MessageSchema>,
  pluralRules: {
    ru: russianPlural,
  },
  missingWarn: false,
  fallbackWarn: false,
})

const loaded = new Set<DevToolsLocale>([DEFAULT_LOCALE])
const pending = new Map<DevToolsLocale, Promise<void>>()

/** Fetch and register the messages of `locale`, once. */
function loadLocaleMessages(locale: DevToolsLocale): Promise<void> {
  if (loaded.has(locale))
    return Promise.resolve()
  let promise = pending.get(locale)
  if (!promise) {
    promise = loaders[locale as keyof typeof loaders]()
      .then((mod) => {
        i18n.global.setLocaleMessage(locale, mod.default)
        loaded.add(locale)
      })
      .finally(() => pending.delete(locale))
    pending.set(locale, promise)
  }
  return promise
}

let switchId = 0

/**
 * Switch the UI to `locale`, loading its messages first so the UI never
 * renders missing keys. Rapid switches resolve to the last requested locale;
 * if a chunk fails to load, the current language stays in place.
 */
export async function setLocale(locale: DevToolsLocale): Promise<void> {
  const id = ++switchId
  try {
    await loadLocaleMessages(locale)
  }
  catch (error) {
    console.error(`[Nuxt DevTools] Failed to load locale "${locale}"`, error)
    return
  }
  if (id !== switchId)
    return
  i18n.global.locale.value = locale
  if (typeof document !== 'undefined')
    document.documentElement.lang = locale
}
