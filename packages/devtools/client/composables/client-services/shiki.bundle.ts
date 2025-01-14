/* Generate by @shikijs/codegen */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type {
  DynamicImportLanguageRegistration,
  DynamicImportThemeRegistration,
  HighlighterGeneric,
} from '@shikijs/types'
import {
  createSingletonShorthands,
  createdBundledHighlighter,
} from '@shikijs/core'
import { createJavaScriptRawEngine } from '@shikijs/engine-javascript/raw'

type BundledLanguage =
  | 'json'
  | 'yaml'
  | 'yml'
  | 'css'
  | 'javascript'
  | 'js'
  | 'typescript'
  | 'ts'
  | 'vue'
  | 'vue-html'
  | 'html'
  | 'diff'
  | 'shellscript'
  | 'bash'
  | 'sh'
  | 'shell'
  | 'zsh'
type BundledTheme = 'vitesse-dark' | 'vitesse-light'
type Highlighter = HighlighterGeneric<BundledLanguage, BundledTheme>

const bundledLanguages = {
  json: () => import('@shikijs/langs-precompiled/json'),
  yaml: () => import('@shikijs/langs-precompiled/yaml'),
  yml: () => import('@shikijs/langs-precompiled/yaml'),
  css: () => import('@shikijs/langs-precompiled/css'),
  javascript: () => import('@shikijs/langs-precompiled/javascript'),
  js: () => import('@shikijs/langs-precompiled/javascript'),
  typescript: () => import('@shikijs/langs-precompiled/typescript'),
  ts: () => import('@shikijs/langs-precompiled/typescript'),
  vue: () => import('@shikijs/langs-precompiled/vue'),
  'vue-html': () => import('@shikijs/langs-precompiled/vue-html'),
  html: () => import('@shikijs/langs-precompiled/html'),
  diff: () => import('@shikijs/langs-precompiled/diff'),
  shellscript: () => import('@shikijs/langs-precompiled/shellscript'),
  bash: () => import('@shikijs/langs-precompiled/shellscript'),
  sh: () => import('@shikijs/langs-precompiled/shellscript'),
  shell: () => import('@shikijs/langs-precompiled/shellscript'),
  zsh: () => import('@shikijs/langs-precompiled/shellscript'),
} as Record<BundledLanguage, DynamicImportLanguageRegistration>

const bundledThemes = {
  'vitesse-dark': () => import('@shikijs/themes/vitesse-dark'),
  'vitesse-light': () => import('@shikijs/themes/vitesse-light'),
} as Record<BundledTheme, DynamicImportThemeRegistration>

const createHighlighter = /* @__PURE__ */ createdBundledHighlighter<
  BundledLanguage,
  BundledTheme
>({
  langs: bundledLanguages,
  themes: bundledThemes,
  engine: () => createJavaScriptRawEngine(),
})

const {
  codeToHtml,
  codeToHast,
  codeToTokensBase,
  codeToTokens,
  codeToTokensWithThemes,
  getSingletonHighlighter,
  getLastGrammarState,
} = /* @__PURE__ */ createSingletonShorthands<BundledLanguage, BundledTheme>(
  createHighlighter,
)

export {
  bundledLanguages,
  bundledThemes,
  codeToHast,
  codeToHtml,
  codeToTokens,
  codeToTokensBase,
  codeToTokensWithThemes,
  createHighlighter,
  getLastGrammarState,
  getSingletonHighlighter,
}
export type { BundledLanguage, BundledTheme, Highlighter }
