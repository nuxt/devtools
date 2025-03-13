import type { CodeHighlightOptions } from '@nuxt/devtools-kit/types'
import type { BundledLanguage, BundledTheme, Highlighter } from './shiki.bundle'
import { shallowRef } from 'vue'
import { bundledLanguages, bundledThemes, createHighlighter } from './shiki.bundle'

export const shiki = shallowRef<Highlighter>()

let promise: Promise<any> | null = null

export function renderCodeHighlight(
  code: string,
  lang: BundledLanguage | 'text' = 'text',
  options?: CodeHighlightOptions,
) {
  if (!promise && !shiki.value) {
    // Only loading when needed
    promise = createHighlighter({
      langs: Object.keys(bundledLanguages) as BundledLanguage[],
      themes: Object.keys(bundledThemes) as BundledTheme[],
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
      ...options,
      lang,
      themes: {
        dark: 'vitesse-dark',
        light: 'vitesse-light',
      },
      transformers: [
        {
          root(hast) {
            return {
              type: 'root',
              // @ts-expect-error hast casting
              children: hast.children[0].children[0].children,
            }
          },
        },
      ],
    }),
    supported: true,
  }
}
