import type { Highlighter, Lang } from 'shiki-es'
import { getHighlighter } from 'shiki-es'

export const shiki = ref<Highlighter>()

// TODO: Only loading when needed
getHighlighter({
  themes: [
    'vitesse-dark',
    'vitesse-light',
  ],
  langs: [
    'css',
    'javascript',
    'typescript',
    'html',
    'vue',
    'vue-html',
  ],
}).then((i) => { shiki.value = i })

export function renderCodeHighlight(code: string, lang: Lang) {
  const mode = useColorMode()
  if (!shiki.value)
    return code
  return shiki.value.codeToHtml(code, {
    lang,
    theme: mode.value === 'dark' ? 'vitesse-dark' : 'vitesse-light',
  })
}
