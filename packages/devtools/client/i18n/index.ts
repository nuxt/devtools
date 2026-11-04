import type { DevToolsLocale } from './locales'
import { createI18n } from 'vue-i18n'
import de from '../locales/de.json'
import en from '../locales/en.json'
import es from '../locales/es.json'
import fr from '../locales/fr.json'
import ja from '../locales/ja.json'
import ko from '../locales/ko.json'
import ptBR from '../locales/pt-BR.json'
import ru from '../locales/ru.json'
import zhCN from '../locales/zh-CN.json'
import zhTW from '../locales/zh-TW.json'
import { DEFAULT_LOCALE } from './locales'

export type MessageSchema = typeof en

const messages: Record<DevToolsLocale, MessageSchema> = {
  'en': en,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  'ja': ja,
  'ko': ko,
  'es': es,
  'fr': fr,
  'de': de,
  'pt-BR': ptBR,
  'ru': ru,
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
  messages,
  pluralRules: {
    ru: russianPlural,
  },
  missingWarn: false,
  fallbackWarn: false,
})
