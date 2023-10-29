import type { BuiltinLanguage, HighlighterCore } from 'shikiji'
import { getHighlighterCore } from 'shikiji/core'
import { getWasmInlined } from 'shikiji/wasm'

export const shiki = shallowRef<HighlighterCore>()

let promise: Promise<any> | null = null

export function renderCodeHighlight(code: string, lang: BuiltinLanguage | 'text' = 'text') {
  if (!promise && !shiki.value) {
    // Only loading when needed
    promise = getHighlighterCore({
      themes: [
        import('shikiji/themes/vitesse-dark.mjs'),
        import('shikiji/themes/vitesse-light.mjs'),
      ],
      langs: [
        import('shikiji/langs/json.mjs'),
        import('shikiji/langs/yaml.mjs'),
        import('shikiji/langs/css.mjs'),
        import('shikiji/langs/javascript.mjs'),
        import('shikiji/langs/typescript.mjs'),
        import('shikiji/langs/vue.mjs'),
        import('shikiji/langs/vue-html.mjs'),
        import('shikiji/langs/html.mjs'),
        import('shikiji/langs/diff.mjs'),
        import('shikiji/langs/shellscript.mjs'),
      ],
      loadWasm: getWasmInlined,
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
      themes: {
        dark: 'vitesse-dark',
        light: 'vitesse-light',
      },
    }),
    supported: true,
  }
}
