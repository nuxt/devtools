import type { Highlighter, Lang } from 'shiki-es'
import { getHighlighter } from 'shiki-es'

export const shiki = ref<Highlighter>()

let promise: Promise<any> | null = null

export function renderCodeHighlight(code: string, lang: Lang) {
  const mode = useColorMode()

  if (!promise && !shiki.value) {
    // Only loading when needed
    promise = getHighlighter({
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
        'bash',
      ],
    }).then((i) => {
      shiki.value = i
    })
  }

  const supported = shiki.value?.getLoadedLanguages().includes(lang)
  if (!supported) {
    return {
      code,
      supported,
    }
  }

  return {
    code: shiki.value!.codeToHtml(code, {
      lang,
      theme: mode.value === 'dark' ? 'vitesse-dark' : 'vitesse-light',
    }),
    supported: true,
  }
}
