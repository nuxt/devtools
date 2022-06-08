import type { Highlighter, Lang } from 'shiki'
import { getHighlighter, setCDN } from 'shiki'

setCDN('/__nuxt_devtools__/client/shiki/')

export const shiki = ref<Highlighter>()

getHighlighter({
  themes: [
    'vitesse-dark',
    'vitesse-light',
  ],
  langs: [
    'css',
    'javascript',
  ],
})
  .then(i => shiki.value = i)

export function highlight(code: string, lang: Lang) {
  const mode = useColorMode()
  if (!shiki.value)
    return code
  return shiki.value.codeToHtml(code, {
    lang,
    theme: mode.value === 'dark' ? 'vitesse-dark' : 'vitesse-light',
  })
}
